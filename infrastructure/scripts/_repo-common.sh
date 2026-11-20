#!/usr/bin/env bash
#
# Paths and names shared by the deployment scripts. Sourced, not run.

# The repository root, from this file's own location, so the scripts work from
# any directory (and from a tarball with no .git).
if [ -z "${REPO_ROOT:-}" ]; then
  REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  export REPO_ROOT
fi

# Also the Kubernetes namespace everything is deployed into.
export PROJECT_NAME="helix-web"

export REPO_DEPLOYMENTS="$REPO_ROOT/deployments"
export REPO_DEPLOYMENTS_HELM="$REPO_DEPLOYMENTS/helm"
export REPO_DEPLOYMENTS_ENVIRONMENTS="$REPO_DEPLOYMENTS/environments"
export REPO_INFRASTRUCTURE="$REPO_ROOT/infrastructure"
export REPO_INFRASTRUCTURE_SCRIPTS="$REPO_INFRASTRUCTURE/scripts"
