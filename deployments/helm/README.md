# Helm charts

| Chart | Renders | For |
| --- | --- | --- |
| [`helix-web`](charts/helix-web) | Deployment, Service, Ingress (cert-manager), PodDisruptionBudget, ServiceAccount; optional HTTPRoute, HPA, NetworkPolicy | helixdesktop.org: the static site behind unprivileged nginx |

Every option is documented in [`charts/helix-web/values.yaml`](charts/helix-web/values.yaml).
The defaults are the helixdesktop.org shape: two replicas spread across nodes,
rolling updates with no unavailability, an Ingress for `helixdesktop.org`
whose certificate cert-manager issues from `ingress.certManager.clusterIssuer`
into the `helixdesktop-org-tls` secret, a read-only root filesystem and no
service account token. The live values (registry, issuer) are in the ignored
`../environments/prod/helix-web-values.yaml`; see [`../README.md`](../README.md).

## Files

| File | Purpose |
| --- | --- |
| `VERSION` | The chart version; `deploy.sh` installs `build/<chart>-<VERSION>.tgz`. |
| `bump-version.sh` | `patch` (default), `minor`, `major` or an explicit SemVer version; writes `VERSION` and every chart's `version`. |
| `build-charts.sh` | Lints each chart and packages it into `build/` (ignored). Fails if a chart's version differs from `VERSION`. |
| `Makefile` | `bump-version [BUMP=...]`, `charts`, `lint`; the repository's `Makefile` calls these. |

```sh
make bump-charts-version [BUMP=minor|major|X.Y.Z]   # from the repository root
make build-charts
make lint-charts
```

## Verifying a change

```sh
helm lint --strict charts/helix-web
helm template helix-web charts/helix-web --namespace helix-web
helm template helix-web charts/helix-web --namespace helix-web \
  -f ../environments/prod/helix-web-values.yaml    # what prod gets
```

After installing, `helm test helix-web --namespace helix-web` fetches
`/healthz` and `/` through the Service.
