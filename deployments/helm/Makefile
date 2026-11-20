.PHONY: bump-version charts lint all

# Patch by default; BUMP=minor, BUMP=major or BUMP=1.2.3 for the others.
BUMP ?= patch

# Target for bumping the version (VERSION and every chart's Chart.yaml)
bump-version:
	./bump-version.sh $(BUMP)

# Target for building the charts into build/
charts:
	./build-charts.sh

# Lint and render every chart, as the build would see it
lint:
	@for chart in charts/*/; do \
		helm lint --strict "$$chart" && \
		helm template lint-check "$$chart" >/dev/null && \
		echo "$$chart renders" || exit 1; \
	done

# Default target that runs build-charts
all: charts
