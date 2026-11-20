# syntax=docker/dockerfile:1.7
#
# helix-web as static files served by nginx.
#
#   docker build -t helix-web .
#   docker run --rm -p 8080:8080 helix-web
#
# The docs are generated from helixdesktop/spec. By default the `spec`
# stage clones it from GitHub (SPEC_REF picks the branch or tag). To build
# from a local checkout instead, override that stage with a named context:
#
#   docker build --build-context spec=../spec -t helix-web .

ARG NODE_IMAGE=node:22.14.0-bookworm-slim
ARG NGINX_IMAGE=nginxinc/nginx-unprivileged:1.27.4-alpine

# --- spec: the specification the docs are built from ----------------------
FROM alpine/git:v2.47.2 AS spec-clone
ARG SPEC_REPO=https://github.com/helixdesktop/spec.git
ARG SPEC_REF=main
RUN git clone --depth 1 --branch "$SPEC_REF" "$SPEC_REPO" /spec && rm -rf /spec/.git

# Only the checkout, at the root, so this stage has the same shape as a
# `--build-context spec=../spec` override (copying the clone stage's root
# would bring the whole git image along and put the docs under /docs/spec).
FROM scratch AS spec
COPY --from=spec-clone /spec /

# --- build: generate the static site --------------------------------------
FROM ${NODE_IMAGE} AS build
# NODE_OPTIONS bounds Node's heap so a build can't swallow the host's
# memory (Docker builds aren't limited by the caller's cgroup).
ENV CI=true \
    NUXT_TELEMETRY_DISABLED=1 \
    NODE_OPTIONS=--max-old-space-size=3072 \
    HELIX_SPEC_DIR=/spec
RUN corepack enable
WORKDIR /app

# Dependencies first, for layer caching. `nuxt prepare` (postinstall) needs
# the sources, so it is skipped here and runs as part of `generate`.
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile --ignore-scripts

COPY --from=spec / /spec
COPY . .
RUN pnpm check-i18n && pnpm generate

# --- runtime: nginx serving .output/public --------------------------------
FROM ${NGINX_IMAGE} AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/.output/public /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO /dev/null http://127.0.0.1:8080/healthz || exit 1
