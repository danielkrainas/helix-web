#!/usr/bin/env bash
#
# Packages every chart under charts/ into build/<chart>-<version>.tgz, which
# is what infrastructure/scripts/deploy.sh installs.

set -euo pipefail

# Load common repo variables
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../infrastructure/scripts/_repo-common.sh"

CHARTS_DIR="$REPO_DEPLOYMENTS_HELM/charts"
BUILD_DIR="$REPO_DEPLOYMENTS_HELM/build"
VERSION=$(tr -d '[:space:]' < "$REPO_DEPLOYMENTS_HELM/VERSION")

mkdir -p "$BUILD_DIR"

echo "Building Helm charts from $CHARTS_DIR (version $VERSION)..."

for CHART in "$CHARTS_DIR"/*/; do
  [ -f "$CHART/Chart.yaml" ] || continue
  CHART_NAME=$(basename "$CHART")

  # deploy.sh looks for <chart>-<VERSION>.tgz, so a chart whose own version
  # has drifted from VERSION would package under a name nothing installs.
  CHART_VERSION=$(sed -n 's/^version:[[:space:]]*"\{0,1\}\([^"[:space:]]*\)"\{0,1\}.*/\1/p' "$CHART/Chart.yaml")
  if [ "$CHART_VERSION" != "$VERSION" ]; then
    echo "ERROR: $CHART_NAME is version $CHART_VERSION but VERSION says $VERSION." >&2
    echo "       Run 'make bump-charts-version BUMP=$VERSION' to line them up." >&2
    exit 1
  fi

  # Only charts with dependencies need them fetched; skipping the others
  # keeps a build of this repo's chart entirely offline.
  if grep -q '^dependencies:' "$CHART/Chart.yaml"; then
    echo "Updating dependencies for $CHART_NAME..."
    helm dependency update "$CHART"
  fi

  echo "Linting $CHART_NAME..."
  helm lint --strict "$CHART"

  echo "Packaging $CHART_NAME..."
  helm package "$CHART" -d "$BUILD_DIR"
done

echo "All charts built and stored in $BUILD_DIR"
