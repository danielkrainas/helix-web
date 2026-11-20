# Deployment tasks for helix-web. The site itself is built with pnpm (see
# README.md); everything here is about the image's Helm chart and putting it
# on the cluster.

HELM_DIR := deployments/helm

# make bump-charts-version [BUMP=patch|minor|major|X.Y.Z]
BUMP ?= patch
# make deploy-prod [IMAGE_TAG=<tag>]: overrides image.tag from the values file.
IMAGE_TAG ?=

.PHONY: help check-prereqs upgrade-charts bump-charts-version build-charts lint-charts deploy-prod

help: ## Show this help
	@echo "Available targets:"
	@awk 'BEGIN {FS = ":.*##"} /^[a-zA-Z0-9_-]+:.*##/ \
		{ printf "  \033[36m%-22s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)
	@echo
	@echo "  BUMP=minor|major|X.Y.Z  with bump-charts-version / upgrade-charts (default: patch)"
	@echo "  IMAGE_TAG=<tag>         with deploy-prod, to deploy one image tag"

upgrade-charts: bump-charts-version build-charts ## Bump the chart version and build the charts

bump-charts-version: ## Bump the Helm chart version (patch; BUMP=minor|major|X.Y.Z)
	$(MAKE) -C $(HELM_DIR) bump-version BUMP=$(BUMP)

build-charts: ## Package the Helm charts into deployments/helm/build/
	$(MAKE) -C $(HELM_DIR) charts

lint-charts: ## Lint and render the Helm charts
	$(MAKE) -C $(HELM_DIR) lint

check-prereqs: ## Check for the tools these targets and the site build need
	@echo "Checking required tools..."
	@for tool in make git helm kubectl node pnpm docker; do \
		if command -v $$tool >/dev/null 2>&1; then echo "  ok       $$tool"; \
		else echo "  MISSING  $$tool"; fi; \
	done
	@echo "Optional: doctl (DigitalOcean registry and cluster access)"
	@command -v doctl >/dev/null 2>&1 && echo "  ok       doctl" || echo "  missing  doctl"

deploy-prod: ## Deploy the packaged chart to prod (IMAGE_TAG=<tag> to pin the image)
	@IMAGE_TAG="$(IMAGE_TAG)" bash -c "source infrastructure/scripts/set-context.sh prod && \
		echo 'Deploying helix-web to prod...' && \
		infrastructure/scripts/deploy.sh prod helix-web"
