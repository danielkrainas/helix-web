#!/usr/bin/env bash
#
# Points kubectl and helm at an environment's cluster. Source it, so the
# KUBECONFIG it exports stays set for what runs next:
#
#   source infrastructure/scripts/set-context.sh prod
#
# Each environment brings its own kubeconfig, kept beside its values file in
# deployments/environments/<env>/kubeconfig.yaml (ignored by git). For
# DigitalOcean Kubernetes:
#
#   doctl kubernetes cluster kubeconfig show <cluster> \
#     > deployments/environments/prod/kubeconfig.yaml
#
# Nothing here talks to the cluster; it only selects it.

# Each failure below ends in `return 1 2>/dev/null || exit 1`: return when
# sourced, so a mistake doesn't close the shell that sourced it, and exit when
# run directly.
_fail() { echo "ERROR: $*" >&2; }

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  set -e  # only set -e if the script is being executed directly
fi

# Load common variables
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/_repo-common.sh"

case "${1:-}" in
  prod)
    export CLUSTER_ENV="prod"
    export CLUSTER_NS="$PROJECT_NAME"
    ;;
  "")
    echo "Usage: source $0 <environment>" >&2
    _fail "no environment given (available: prod)"; return 1 2>/dev/null || exit 1
    ;;
  *)
    _fail "unknown environment '$1' (available: prod)"; return 1 2>/dev/null || exit 1
    ;;
esac

export KUBECONFIG="$REPO_DEPLOYMENTS_ENVIRONMENTS/$CLUSTER_ENV/kubeconfig.yaml"
if [ ! -f "$KUBECONFIG" ]; then
  _fail "kubeconfig not found at '$KUBECONFIG'."; return 1 2>/dev/null || exit 1
fi

echo "Switched to '$CLUSTER_ENV' (namespace '$CLUSTER_NS')."
echo "Using kubeconfig: $KUBECONFIG"
kubectl config current-context
