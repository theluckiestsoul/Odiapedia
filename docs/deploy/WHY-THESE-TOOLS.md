# Why these tools

Every choice in this setup aims at the same three goals: learn real, transferable Kubernetes skills; keep the bill around $24/month; and stay free to move from DigitalOcean to GCP or elsewhere later. Each table puts the chosen option first.

## At a glance

| Layer | Chosen | Main reason | Closest alternative |
| --- | --- | --- | --- |
| Cloud | DigitalOcean | Flat price with 4 TB transfer included, Bangalore region, simple | GCP (more services, pay per GB of traffic) |
| Infrastructure as code | Terraform | Industry standard, one tool for every cloud | OpenTofu (open-source fork, same language) |
| Operating system | Ubuntu 24.04 LTS | Best-documented host for kubeadm and containerd | Debian 12 |
| Kubernetes install | kubeadm | The official, "real" cluster; what CKA teaches | k3s (lighter, fewer moving parts) |
| Container runtime | containerd 2.x | Default runtime almost everywhere, including GKE | CRI-O |
| Pod network | Calico | Network policies, hostPort, widely used | Cilium (eBPF, more features, heavier) |
| Ingress | Traefik | Maintained, simple Helm install, reads standard Ingress | Envoy Gateway / NGINX Gateway Fabric (Gateway API) |
| Ports 80/443 | hostPort on the node | No $12/month load balancer | DigitalOcean Load Balancer, or MetalLB |
| HTTPS | cert-manager + Let's Encrypt | Automatic, free, works on any cluster | Cloudflare in front, or Traefik's built-in ACME |
| Image registry | GHCR | Free, next to the code, GitHub Actions logs in by itself | Docker Hub, DigitalOcean Container Registry |
| App manifests | Kustomize | Plain YAML, built into kubectl | Writing a Helm chart for the app |
| Deploys | GitHub Actions over SSH | Simple, nothing extra running in the cluster | GitOps with Argo CD or Flux |

## Infrastructure

### Cloud provider

DigitalOcean won on predictable cost and simplicity. GCP is the natural next step, and the Terraform and Kubernetes skills carry over.

| Option | Pros | Cons |
| --- | --- | --- |
| **DigitalOcean (chosen)** | Flat monthly price; outbound data transfer included with each droplet; Bangalore region; short, readable dashboard and API | Fewer services than the big clouds; managed Kubernetes and load balancers cost extra |
| GCP | Mumbai region; huge ecosystem (GKE, Cloud Run, databases, AI); $300 free credit for new accounts | Traffic billed per GB; a public IPv4 address is charged separately; billing has many line items |
| AWS | Market leader, most job postings ask for it | Most complex console and pricing; easy to get surprise bills |
| Hetzner | Cheapest for the hardware you get | No India region, so slower for Odisha readers |
| Vercel (current) | Zero server work; preview deploys | Usage limits you hit; Hobby plan is non-commercial; teaches no infrastructure |

### Infrastructure as code

Terraform is the tool most teams and job descriptions use, and one language covers DigitalOcean, GCP, AWS and Cloudflare.

| Option | Pros | Cons |
| --- | --- | --- |
| **Terraform (chosen)** | Industry standard; providers for every cloud; huge set of examples | Business Source licence since 2023 (free for your use, but not open source) |
| OpenTofu | Open-source fork of Terraform; same `.tf` files and commands (`tofu plan`) | Smaller community; a few newer features differ |
| Pulumi | Write infrastructure in TypeScript or Python | Less common in job postings; state service or self-managed backend |
| DigitalOcean dashboard by hand | Fastest the first time | Not repeatable, not reviewable, nothing to learn for other clouds |

Switching later is cheap: OpenTofu runs these same files unchanged.

### Operating system

| Option | Pros | Cons |
| --- | --- | --- |
| **Ubuntu 24.04 LTS (chosen)** | Supported until 2029; the OS most kubeadm, containerd and Calico guides assume; DigitalOcean's default image | Ships snaps and extras you don't need |
| Debian 12 | Smaller and very stable; same `apt` commands | Older package versions |
| Rocky / AlmaLinux | Close to Red Hat, common in enterprises | Different package manager (`dnf`) and SELinux steps; fewer beginner guides |
| Talos Linux / Flatcar | Built only for Kubernetes, very secure | No `apt install`: hides exactly what you want to learn |

## Cluster

### How Kubernetes is installed

You asked to learn by building it yourself, and kubeadm is the official tool that does exactly that, one visible step at a time. It is also what the CKA certification is based on.

| Option | Pros | Cons |
| --- | --- | --- |
| **kubeadm (chosen)** | Upstream, vendor-neutral Kubernetes; you see every part (certificates, static pods, etcd, CNI); skills transfer to any cluster | Most steps; you own upgrades and yearly certificate renewal; needs 2 CPUs ($24 droplet) |
| k3s | One-command install; runs on the $12 droplet; Traefik and a CNI included | Hides the internals; uses a different datastore by default, so less transferable when debugging |
| Managed (DOKS, GKE) | Provider runs and upgrades the control plane; closest to most jobs | Learn less of the inside; with a load balancer about $36/month on DigitalOcean |
| RKE2, MicroK8s | Secure defaults (RKE2) or snap-based simplicity (MicroK8s) | Vendor-specific tooling on top of Kubernetes |
| Docker Compose (no Kubernetes) | Simplest way to run one container on one server | No Kubernetes learning, which is the point here |

### Container runtime

| Option | Pros | Cons |
| --- | --- | --- |
| **containerd 2.x (chosen)** | The default runtime in GKE, EKS, AKS, k3s; small; graduated CNCF project | Its own CLI (`ctr`, or `crictl`) feels different from `docker` |
| CRI-O | Built only for Kubernetes; default in OpenShift; versions follow Kubernetes | Separate install repo per Kubernetes version; less common outside Red Hat |
| Docker Engine (via cri-dockerd) | Familiar `docker` commands on the node | Extra adapter since Kubernetes removed dockershim in 1.24; not recommended for new clusters |

### Pod network (CNI)

| Option | Pros | Cons |
| --- | --- | --- |
| **Calico (chosen)** | NetworkPolicy (pod firewall rules) built in; supports hostPort, which Traefik needs here; very widely used; operator handles upgrades | More components than Flannel |
| Flannel | Smallest and simplest | No NetworkPolicy, so no pod firewall rules |
| Cilium | eBPF based: fast, great visibility (Hubble), can replace kube-proxy; default in GKE Dataplane V2 | More to learn and more memory; overkill on one node |
| Weave Net | Was simple to install | No longer maintained, avoid |

Cilium is the best next thing to learn once the cluster runs: rebuilding with it is a good exercise.

## Traffic

### Ingress controller

The Ingress controller is the program that receives web requests and routes them to the right pods. The long-time default, community ingress-nginx, was retired in March 2026, so a new setup should not start on it.

| Option | Pros | Cons |
| --- | --- | --- |
| **Traefik (chosen)** | Actively maintained; one Helm install; reads standard Ingress and also Gateway API, so you can move to Gateway API later without changing controller; built-in dashboard | Its own CRDs (IngressRoute) tempt you away from portable standard objects |
| ingress-nginx | Most tutorials still show it | Retired: no more fixes, including security fixes |
| NGINX Gateway Fabric, Envoy Gateway | Built for Gateway API, the successor to Ingress; strong long-term direction | Gateway API has more objects to learn (GatewayClass, Gateway, HTTPRoute) |
| HAProxy Ingress, Contour | Mature and fast | Smaller communities, fewer guides |

### Getting ports 80/443 into the cluster

On a managed cloud cluster, a `LoadBalancer` service asks the cloud for a load balancer. On your own droplet there is none, so something has to bind the server's ports.

| Option | Pros | Cons |
| --- | --- | --- |
| **hostPort on a Traefik DaemonSet (chosen)** | Free; standard Kubernetes; works with the reserved IP | One node only takes traffic; Traefik upgrades cause a few seconds of downtime |
| DigitalOcean Load Balancer | Health checks, can spread traffic across several nodes | $12/month extra, half again on top of the $24 droplet |
| MetalLB | Gives bare-metal clusters real `LoadBalancer` services | Needs extra IP addresses the cloud network will route; little value on one droplet |
| NodePort | Simplest service type | Ports 30000–32767 only, so browsers can't use it directly |
| hostNetwork | Pod uses the node's network directly | Needs to run as root to bind ports below 1024; less isolation |

### HTTPS certificates

| Option | Pros | Cons |
| --- | --- | --- |
| **cert-manager + Let's Encrypt (chosen)** | Free, automatic renewal; certificates are normal Kubernetes secrets any controller can use; the same setup works on GKE or anywhere | One more component to install and upgrade |
| Traefik's built-in ACME | No extra component | Certificates live inside Traefik's own storage; harder with several Traefik pods or a later switch of controller |
| Cloudflare proxy in front | Free CDN, caching and DDoS protection too | Visitors see Cloudflare's certificate; the server still needs its own for full encryption, so it complements cert-manager rather than replacing it |

Adding Cloudflare's free proxy on top of this setup later is a good idea for speed and caching.

## Delivery

### Image registry

| Option | Pros | Cons |
| --- | --- | --- |
| **GitHub Container Registry (chosen)** | Free for public images; lives next to the code; GitHub Actions logs in with its built-in token, no extra secret | Private images count against a small free storage quota |
| Docker Hub | The best-known registry | Anonymous pulls are rate-limited; another account and token to manage |
| DigitalOcean Container Registry | Same data centre as the droplet, fast pulls | Paid beyond a small free tier; ties the images to DigitalOcean |
| Self-hosted (Harbor) | Full control, vulnerability scanning | Another service to run and back up |

### Packaging the app's manifests

| Option | Pros | Cons |
| --- | --- | --- |
| **Kustomize (chosen)** | Plain YAML you can read; built into `kubectl`; overlays per cluster (`k8s/overlays/production`) make a GKE overlay easy later | No templating logic or packaging for others |
| Helm chart for the app | Values files, versioned releases, `helm rollback` | Go templates are harder to read; more than one app on one cluster needs |
| Plain YAML files only | Nothing to learn | Copy-paste for every environment |

Helm is still used for the add-ons (Traefik, cert-manager), because their projects publish official charts.

### How deploys reach the cluster

| Option | Pros | Cons |
| --- | --- | --- |
| **GitHub Actions + `kubectl apply` over SSH (chosen)** | Easy to follow; the Kubernetes API (port 6443) stays closed to the internet; automatic rollback on failed health checks | GitHub holds an SSH key to the server; pushes from outside rather than syncing from inside |
| GitOps with Argo CD or Flux | The cluster pulls from git and fixes drift by itself; a web UI (Argo CD); common in companies | Another component using memory on a 4 GB node; more concepts at once |
| GitHub Actions talking to the API on port 6443 | No SSH needed | Exposes the API server to the internet, or needs a tunnel or VPN |

Argo CD is a good next step once the basics feel easy: the manifests in `k8s/` already work with it unchanged.

## Sources

- [Ingress NGINX retirement](https://www.cncf.io/blog/2026/04/02/ingress-nginx-retirement-experience-from-end-users/) (CNCF)
- [DigitalOcean Droplet pricing](https://www.digitalocean.com/pricing/droplets) and [Kubernetes pricing](https://www.digitalocean.com/pricing/kubernetes)
- [GCP network pricing](https://cloud.google.com/vpc/network-pricing)
- [Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)
- [Calico quickstart](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)
