#!/usr/bin/env bash
#
# Bumps the Helm chart version: deployments/helm/VERSION and the `version:` of
# every chart under charts/, so the two never disagree.
#
#   ./bump-version.sh            # patch: 0.2.0 -> 0.2.1
#   ./bump-version.sh minor      # 0.2.1 -> 0.3.0
#   ./bump-version.sh major      # 0.3.0 -> 1.0.0
#   ./bump-version.sh 1.4.0      # exactly this (any SemVer 2, e.g. 1.4.0-rc.1)
#
# From the repository root: make bump-charts-version [BUMP=minor|major|X.Y.Z]
#
# appVersion is left alone: it names the site's release, not the chart's.

set -euo pipefail

# Load common repo variables
source "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../../infrastructure/scripts/_repo-common.sh"

VERSION_FILE="$REPO_DEPLOYMENTS_HELM/VERSION"
CHARTS_DIR="$REPO_DEPLOYMENTS_HELM/charts"
SEMVER='^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$'

usage() {
  echo "Usage: $0 [patch|minor|major|X.Y.Z]" >&2
  exit 1
}

[ "$#" -le 1 ] || usage
BUMP=${1:-patch}

CURRENT=$(tr -d '[:space:]' < "$VERSION_FILE")
if ! [[ "$CURRENT" =~ $SEMVER ]]; then
  echo "ERROR: $VERSION_FILE holds '$CURRENT', which is not a SemVer version." >&2
  exit 1
fi
MAJOR=${BASH_REMATCH[1]}
MINOR=${BASH_REMATCH[2]}
PATCH=${BASH_REMATCH[3]}
PRERELEASE=${BASH_REMATCH[4]}

case "$BUMP" in
  # A pre-release patch bump finishes that release (1.0.0-rc.1 -> 1.0.0), as
  # SemVer orders them, rather than skipping past it.
  patch) if [ -n "$PRERELEASE" ]; then NEXT="$MAJOR.$MINOR.$PATCH"
         else NEXT="$MAJOR.$MINOR.$((PATCH + 1))"; fi ;;
  minor) NEXT="$MAJOR.$((MINOR + 1)).0" ;;
  major) NEXT="$((MAJOR + 1)).0.0" ;;
  -h|--help) usage ;;
  *)
    NEXT=${BUMP#v}
    if ! [[ "$NEXT" =~ $SEMVER ]]; then
      echo "ERROR: '$BUMP' is neither patch, minor, major nor a SemVer version." >&2
      usage
    fi
    ;;
esac

# Setting the current version again is allowed: it brings any chart that has
# drifted back in line with VERSION.
if [ "$NEXT" = "$CURRENT" ]; then
  echo "VERSION is already $CURRENT; syncing the charts to it."
fi

printf '%s\n' "$NEXT" > "$VERSION_FILE"

for CHART in "$CHARTS_DIR"/*/Chart.yaml; do
  [ -f "$CHART" ] || continue
  # Only the top-level key: a dependency's indented `version:` stays put.
  sed -i.bak -E "s/^version:.*/version: $NEXT/" "$CHART" && rm -f "$CHART.bak"
  echo "$(basename "$(dirname "$CHART")"): version $NEXT"
done

echo "Chart version: $CURRENT -> $NEXT"
echo "Next: make build-charts, then commit VERSION and the Chart.yaml files."
