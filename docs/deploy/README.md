# Hosting Odiapedia: Docker + Kubernetes (k3s) + Terraform

```
 git push ──► GitHub Actions ──► Docker image ──► GHCR (ghcr.io/theluckiestsoul/odiapedia:sha-xxxxxxx)
                                                     │
                     kubectl apply over SSH ◄────────┘
                               │
   Terraform ──► DigitalOcean droplet (Ubuntu) ──► k3s (Kubernetes)
                                                    ├─ Traefik      (ingress: routes odiapedia.com to the app)
                                                    ├─ cert-manager (free HTTPS certificates from Let's Encrypt)
                                                    └─ odiapedia    (Deployment → Pod running the Docker image)
```

| Folder / file | What it is | Tied to a provider? |
|---|---|---|
| `Dockerfile` | How the site is packaged into an image | No |
| `k8s/base` | Deployment, Service, Ingress for the site | No |
| `k8s/cluster` | Let's Encrypt issuer (cluster-wide) | No |
| `k8s/overlays/production` | Image name/tag, ingress class (`traefik` on k3s) | Slightly (ingress class) |
| `infra/terraform/digitalocean` | The server, firewall, fixed IP, first-boot setup | Yes, DigitalOcean only |
| `.github/workflows/deploy.yml` | Build → push → deploy → auto-rollback | No (talks to any k3s server over SSH) |
| `.github/workflows/infra-check.yml` | `terraform validate` + manifest validation on changes | No |

Moving to GCP or another provider later means adding `infra/terraform/gcp` (or using GKE) — the image and `k8s/` stay the same.

## Cost

| Item | Monthly |
|---|---|
| Droplet `s-1vcpu-2gb` (default) | $12 |
| Droplet `s-2vcpu-4gb` (if you want headroom; change `size`) | $24 |
| Reserved IP (while attached) | $0 |
| GHCR images (public package) | $0 |
| GitHub Actions minutes (public repo, or ≈ 15 min/build on the 2,000 free private minutes) | $0 |

## One-time setup

You need: a DigitalOcean account, [Terraform](https://developer.hashicorp.com/terraform/install) (`brew install terraform`), and `kubectl` is optional (it already runs on the server).

### 1. Let the first image build

Push this change. The **Build and deploy** workflow builds the image even though deploying is still switched off.
Check it under GitHub → Actions. Then in GitHub → your profile → Packages → `odiapedia` → Package settings:

- **Recommended:** change visibility to **Public**. The image only contains the public website (no secrets), and public packages have no storage limit.
- If you keep it private: create a classic personal access token with only `read:packages` and save it as the repo secret `GHCR_PULL_TOKEN`.

Also copy any `NEXT_PUBLIC_*` values from Vercel → Settings → Environment Variables into GitHub → Settings → Secrets and variables → Actions → **Variables** (`NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` — only the ones you use).

### 2. Create a deploy SSH key for GitHub Actions

```bash
ssh-keygen -t ed25519 -f ~/.ssh/odiapedia_deploy -N "" -C "github-actions-deploy"
cat ~/.ssh/odiapedia_deploy.pub     # goes into terraform.tfvars
cat ~/.ssh/id_ed25519.pub           # your own key, also into terraform.tfvars (create one with ssh-keygen if missing)
```

### 3. Create the server with Terraform

DigitalOcean → API → Generate New Token (read + write). Then:

```bash
cd infra/terraform/digitalocean
cp terraform.tfvars.example terraform.tfvars     # paste the two public keys
export DIGITALOCEAN_TOKEN=dop_v1_xxx

terraform init      # downloads the DigitalOcean provider
terraform plan      # shows what will be created: key(s), droplet, reserved IP, firewall
terraform apply     # creates it (type "yes")
```

It prints `public_ip`. First boot takes 3–5 minutes (updates, k3s, cert-manager). Check:

```bash
ssh deploy@<public_ip>
kubectl get nodes                       # STATUS Ready
kubectl -n cert-manager get pods        # 3 pods Running
```

`terraform.tfvars` and `terraform.tfstate` stay on your Mac (git-ignored). Keep the state file safe — it is how Terraform knows what it created.

### 4. Turn on deploys

GitHub → Settings → Secrets and variables → Actions:

| Kind | Name | Value |
|---|---|---|
| Secret | `DEPLOY_HOST` | the `public_ip` |
| Secret | `DEPLOY_SSH_KEY` | contents of `~/.ssh/odiapedia_deploy` (the private key) |
| Secret (optional) | `TRIP_LEAD_WEBHOOK_URL`, `TRIP_LEAD_WEBHOOK_SECRET` | same as in Vercel, if set |
| Variable | `K8S_DEPLOY` | `true` |

Then Actions → **Build and deploy** → Run workflow. When it is green, test the server before touching DNS:

```bash
curl -sI -H "Host: odiapedia.com" http://<public_ip>/      # HTTP/1.1 200
```

### 5. Switch the domain

At your domain's DNS provider, set **A** records for `odiapedia.com` and `www` to `public_ip` (remove the Vercel records).
Within a few minutes cert-manager gets the HTTPS certificate:

```bash
kubectl -n odiapedia get certificate      # READY True
```

When the site works on the new server, remove the domain from the Vercel project (or disconnect its Git integration) so pushes don't build twice.

Optional: put Cloudflare (free) in front for caching. Turn the orange-cloud proxy on only after the certificate is READY, with SSL mode **Full (strict)**.

## Everyday use

| Task | How |
|---|---|
| Deploy | `git push origin main` (build ≈ 10–15 min, rollout ≈ 1 min) |
| Roll back | Actions → Build and deploy → Run workflow → `image_tag` = an older tag such as `sha-1a2b3c4` (tags are listed under Packages → odiapedia). No rebuild. |
| Quick undo on the server | `kubectl -n odiapedia rollout undo deployment/odiapedia` |
| See what is running | `kubectl -n odiapedia get deploy,pods -o wide` |
| Logs | `kubectl -n odiapedia logs deploy/odiapedia --tail=100 -f` |
| Restart | `kubectl -n odiapedia rollout restart deployment/odiapedia` |
| Run the image on your Mac | `docker run --rm -p 3000:3000 ghcr.io/theluckiestsoul/odiapedia:latest` |
| Bigger server | set `size = "s-2vcpu-4gb"` in `terraform.tfvars`, `terraform apply` (the droplet restarts, IP stays) |
| Delete everything | `terraform destroy` |

A failed deploy never replaces the running site: Kubernetes starts the new version first (`maxUnavailable: 0`), sends traffic only after it answers health checks, and the workflow runs `rollout undo` if it doesn't become healthy within 10 minutes.

## Moving to another provider later

1. Create a cluster there (e.g. GKE with Terraform in `infra/terraform/gcp`, or k3s on any Ubuntu VM — the same `cloud-init.yaml.tftpl` works on most clouds).
2. Copy `k8s/overlays/production` to a new overlay and set the ingress class that cluster uses (e.g. `nginx` or `gce`).
3. Point `DEPLOY_HOST` at the new server (or change the deploy step to use a kubeconfig for a managed cluster).
4. Deploy, test with the `curl -H "Host: ..."` trick, then switch DNS.
