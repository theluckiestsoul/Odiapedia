# Hosting Odiapedia: Docker + Kubernetes (kubeadm) + Terraform

```
 git push ──► GitHub Actions ──► Docker image ──► GHCR (ghcr.io/theluckiestsoul/odiapedia:sha-xxxxxxx)
                                                     │
                     kubectl apply over SSH ◄────────┘
                               │
   Terraform ──► DigitalOcean droplet (Ubuntu 24.04) ──► Kubernetes installed by hand with kubeadm
                                                          ├─ Calico        (pod network)
                                                          ├─ Traefik       (ingress on ports 80/443)
                                                          ├─ cert-manager  (free HTTPS from Let's Encrypt)
                                                          └─ odiapedia     (Deployment → Pod running the image)
```

## Guides

| Guide | What you do |
|---|---|
| [TERRAFORM-BY-HAND.md](TERRAFORM-BY-HAND.md) | Write the Terraform yourself, resource by resource, and create the server |
| [WHY-THESE-TOOLS.md](WHY-THESE-TOOLS.md) | Why each tool was picked, with the alternatives' pros and cons |
| [KUBERNETES-SETUP.md](KUBERNETES-SETUP.md) | Install Kubernetes on that server with kubeadm, add Calico, Traefik and cert-manager, deploy the site, switch DNS, and look after the cluster |

## What lives where

| Folder / file | What it is | Tied to a provider? |
|---|---|---|
| `Dockerfile` | How the site is packaged into an image | No |
| `k8s/base` | Deployment, Service, Ingress for the site | No |
| `k8s/cluster` | Let's Encrypt issuer (cluster-wide) | No |
| `k8s/overlays/production` | Image name/tag, ingress class `traefik` | No |
| `k8s/addons/traefik-values.yaml` | Helm settings for Traefik on one node without a load balancer | No |
| `infra/terraform/digitalocean` | Server, firewall, fixed IP, first-boot user setup (the answer key for the Terraform guide) | Yes, DigitalOcean only |
| `.github/workflows/deploy.yml` | Build → push → deploy → automatic rollback | No (any cluster reachable over SSH) |
| `.github/workflows/infra-check.yml` | `terraform validate` + manifest validation on changes | No |

Moving to GCP or another provider later means a new `infra/terraform/<provider>` folder and the same Kubernetes steps on the new server; the image and `k8s/` stay the same.

## Cost

| Item | Monthly |
|---|---|
| Droplet `s-2vcpu-4gb` (kubeadm needs 2 CPUs) | $24 |
| Reserved IP (while attached) | $0 |
| GHCR images (public package) | $0 |
| GitHub Actions minutes | $0 within the free allowance |

## Everyday use

| Task | How |
|---|---|
| Deploy | `git push origin main` (build ≈ 10–15 min, rollout ≈ 1 min) |
| Roll back | Actions → Build and deploy → Run workflow → `image_tag` = an older tag such as `sha-1a2b3c4`. No rebuild. |
| Quick undo on the server | `kubectl -n odiapedia rollout undo deployment/odiapedia` |
| See what is running | `kubectl -n odiapedia get deploy,pods -o wide` |
| Logs | `kubectl -n odiapedia logs deploy/odiapedia --tail=100 -f` |
| Run the image on your Mac | `docker run --rm -p 3000:3000 ghcr.io/theluckiestsoul/odiapedia:latest` |

Deploying stays switched off until the repository variable `K8S_DEPLOY` is `true`; images are built on every push regardless.
