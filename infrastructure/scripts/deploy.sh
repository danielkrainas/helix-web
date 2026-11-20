#!/usr/bin/env bash
#
# Installs or upgrades a packaged chart in an environment:
#
#   infrastructure/scripts/deploy.sh <environment> <chart-name> [release-name]
#
# It installs deployments/helm/build/<chart>-<VERSION>.tgz (make build-charts)
# with deployments/environments/<environment>/<release>-values.yaml, into the
# helix-web namespace, on whichever cluster KUBECONFIG points at. Run it after
# set-context.sh, as `make deploy-prod` does.
#
# IMAGE_TAG, when set, overrides the values file's image.tag for this deploy,
# e.g. to roll out (or back to) one of the immutable tags the build workflow
# pushes:
#
#   IMAGE_TAG=1a2b3c4-spec-5d6e7f8 infrastructure/scripts/deploy.sh prod helix-web

set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <environment> <chart-name> [release-name]" >&2
  exit 1
fi

CLUSTER_ENV=$1
CHART=$2
RELEASE_NAME=${3:-$CHART}  # Use 3rd argument if provided, else default to chart name

# Load common variables
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_repo-common.sh"

NAMESPACE=${CLUSTER_NS:-$PROJECT_NAME}

if [ -z "${KUBECONFIG:-}" ]; then
  echo "ERROR: KUBECONFIG is not set; source infrastructure/scripts/set-context.sh $CLUSTER_ENV first." >&2
  exit 1
fi

echo "Deploying $CHART to $CLUSTER_ENV (release: $RELEASE_NAME, namespace: $NAMESPACE)..."

# Read the chart version from the VERSION file
VERSION_FILE="$REPO_DEPLOYMENTS_HELM/VERSION"
if [ ! -f "$VERSION_FILE" ]; then
  echo "ERROR: VERSION file not found at $VERSION_FILE" >&2
  exit 1
fi
CHART_VERSION=$(tr -d '[:space:]' < "$VERSION_FILE")
if [ -z "$CHART_VERSION" ]; then
  echo "ERROR: Chart version is empty in $VERSION_FILE" >&2
  exit 1
fi

CHART_PACKAGE="$REPO_DEPLOYMENTS_HELM/build/${CHART}-${CHART_VERSION}.tgz"
if [ ! -f "$CHART_PACKAGE" ]; then
  echo "ERROR: Helm chart package not found at $CHART_PACKAGE (run 'make build-charts')." >&2
  exit 1
fi

VALUES_FILE="$REPO_DEPLOYMENTS_ENVIRONMENTS/$CLUSTER_ENV/$RELEASE_NAME-values.yaml"
if [ ! -f "$VALUES_FILE" ]; then
  echo "ERROR: values file not found at $VALUES_FILE" >&2
  exit 1
fi
# The values file ships with placeholders for the registry; deploying them
# would leave every pod in ImagePullBackOff.
if grep -nE '^[^#]*FILL-ME-IN' "$VALUES_FILE" >&2; then
  echo "ERROR: $VALUES_FILE still has FILL-ME-IN placeholders (above)." >&2
  exit 1
fi

echo "Using Helm chart package: $CHART_PACKAGE (version: $CHART_VERSION)"
echo "Using values: $VALUES_FILE"

EXTRA_ARGS=()
if [ -n "${IMAGE_TAG:-}" ]; then
  echo "Using image tag: $IMAGE_TAG"
  EXTRA_ARGS+=(--set-string "image.tag=$IMAGE_TAG")
fi

# Extra objects for this environment that aren't part of the chart, such as a
# registry pull secret from `doctl registry kubernetes-manifest`. Ignored by
# git along with the rest of the environment. Applied before the release so
# a pull secret is there when the new pods start.
MANIFESTS_DIR="$REPO_DEPLOYMENTS_ENVIRONMENTS/$CLUSTER_ENV/manifests"
if [ -d "$MANIFESTS_DIR" ]; then
  echo "Applying manifests from $MANIFESTS_DIR..."
  kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -
  kubectl apply --namespace "$NAMESPACE" -f "$MANIFESTS_DIR/"
fi

# --wait: the Deployment rolls one pod at a time with no unavailability, so
# waiting for it is what tells a good deploy from one stuck pulling an image.
helm upgrade --install "$RELEASE_NAME" "$CHART_PACKAGE" \
  -f "$VALUES_FILE" \
  ${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"} \
  --namespace "$NAMESPACE" \
  --create-namespace \
  --wait --timeout 5m

echo "Deployment to $CLUSTER_ENV complete!"
