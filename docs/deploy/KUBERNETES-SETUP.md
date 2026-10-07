# Odiapedia: Kubernetes by hand with kubeadm

Written October 2026 for Kubernetes v1.37, Calico v3.33, Helm 4, cert-manager v1.21. Check for newer versions before you start.

## What you'll build

You will install a one-node Kubernetes v1.37 cluster with kubeadm on a $24/month DigitalOcean droplet, then let GitHub Actions deploy Odiapedia onto it. Plan on 60–90 minutes the first time.

One machine plays both roles: the control plane (the cluster's brain) and the worker (where Odiapedia runs). Every step below is what you would do on a multi-node cluster too; you just skip joining extra workers.

```
 Visitors ──► odiapedia.com
                │ ports 80/443
 ┌──────────────▼──── Droplet, Ubuntu 24.04 (Terraform, step 1) ─────────────┐
 │  Traefik (step 7) ──► Service ──► Odiapedia pod (step 8)                    │◄── GitHub Actions: kubectl apply over SSH
 │  cert-manager (step 7): HTTPS certificates                                  │
 │  Control plane (step 5): API server · etcd · scheduler · controller manager │
 │  kubelet (step 4) · Calico pod network (step 6) · containerd (step 3)       │◄── GHCR: Docker images
 └─────────────────────────────────────────────────────────────────────────────┘
```

A visitor's request goes Traefik → Service → pod; the layers underneath are what you install in steps 3–7.

| Layer | What it does | Installed in |
| --- | --- | --- |
| Ubuntu 24.04 droplet | The virtual machine, created by Terraform | Step 1 |
| Kernel settings | Swap off, `overlay` + `br_netfilter` modules, IP forwarding | Step 2 |
| containerd 2.x | Runs containers (Kubernetes talks to it through CRI) | Step 3 |
| kubelet, kubeadm, kubectl | Node agent, cluster installer, command-line client | Step 4 |
| Control plane | API server, etcd, scheduler, controller manager (static pods) | Step 5 |
| Calico | Pod network: gives every pod an IP and lets them talk | Step 6 |
| Helm, Traefik, cert-manager | Package manager, ingress on ports 80/443, free HTTPS | Step 7 |
| Odiapedia | The Deployment, Service and Ingress from `k8s/` in the repo | Step 8 |

What you need on your Mac: Terraform (`brew install terraform`), an SSH key, a DigitalOcean account and API token, and push access to the GitHub repo.

Kubernetes needs at least 2 CPUs and 2 GB RAM per control-plane machine, so this guide uses the `s-2vcpu-4gb` droplet ($24/month). The $12 1-CPU droplet is too small for kubeadm.

The repo's `docs/deploy/KUBERNETES-SETUP.md` has the same steps, kept next to the code.

## Step 1: Create the server with Terraform

Terraform creates a plain Ubuntu server: a droplet, a fixed (reserved) IP, a firewall that allows only ports 22, 80 and 443, and a `deploy` user that logs in with SSH keys only. Nothing Kubernetes-related is installed; that is your job in steps 2–7.

To learn Terraform, write these files yourself first: follow [TERRAFORM-BY-HAND.md](TERRAFORM-BY-HAND.md), then come back to step 2. The short path below uses the finished files from the repo.

1. Make two SSH keys on your Mac, one for you and one for GitHub Actions:

```bash
ls ~/.ssh/id_ed25519.pub || ssh-keygen -t ed25519           # your own key
ssh-keygen -t ed25519 -f ~/.ssh/odiapedia_deploy -N "" -C "github-actions-deploy"
```

2. In DigitalOcean go to API → Generate New Token (read and write). Then:

```bash
cd infra/terraform/digitalocean
cp terraform.tfvars.example terraform.tfvars
# paste the contents of ~/.ssh/id_ed25519.pub and ~/.ssh/odiapedia_deploy.pub into ssh_public_keys
export DIGITALOCEAN_TOKEN=dop_v1_xxx

terraform init      # downloads the DigitalOcean provider
terraform plan      # read it: 2 SSH keys, 1 droplet, 1 reserved IP + assignment, 1 firewall
terraform apply     # type yes; prints public_ip
```

3. Wait about 2 minutes for first boot, then log in and check:

```bash
ssh deploy@<public_ip>
lsb_release -d          # Ubuntu 24.04
nproc; free -h          # 2 CPUs, ~4 GB RAM
```

Keep `terraform.tfstate` safe on your Mac (it is git-ignored). It is Terraform's record of what it created, and `terraform destroy` needs it to delete everything later.

All commands from here on run on the server as `deploy`, unless marked "on your Mac".

## Step 2: Prepare the operating system

Kubernetes needs three things from Linux: no swap, two kernel modules for container networking, and IP forwarding so traffic can move between pods.

1. Turn swap off. By default the kubelet refuses to start if swap is on. DigitalOcean droplets have none, but check:

```bash
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab     # keep it off after reboots
free -h                                       # Swap: 0B
```

2. Load the kernel modules. `overlay` is the filesystem containers are built from; `br_netfilter` lets the firewall see traffic crossing the pod network bridge:

```bash
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter
lsmod | grep -E 'overlay|br_netfilter'
```

3. Turn on IP forwarding and let iptables see bridged traffic:

```bash
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.ipv4.ip_forward = 1
net.bridge.bridge-nf-call-iptables = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF
sudo sysctl --system
sysctl net.ipv4.ip_forward                    # = 1
```

Why: a pod's traffic leaves through a virtual bridge and gets forwarded to other pods or out to the internet. Without forwarding, packets stop at the node.

## Step 3: Install the container runtime (containerd)

Kubernetes does not run containers itself. The kubelet asks a container runtime to do it, and containerd is the standard one. Use containerd 2.x from Docker's package repository; Kubernetes 1.36 and later no longer support containerd 1.x.

1. Add Docker's repository and install only `containerd.io` (not Docker itself):

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gpg
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list
sudo apt-get update
sudo apt-get install -y containerd.io
containerd --version                          # must say 2.x
```

2. Write a full default config. The package ships a config that switches off the CRI plugin Kubernetes needs, so replace it:

```bash
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml > /dev/null
```

3. Use the systemd cgroup driver. Ubuntu's init system (systemd) manages CPU and memory limits; containerd and the kubelet must use the same manager, or pods get killed at random under load:

```bash
sudo sed -i 's/SystemdCgroup = false/SystemdCgroup = true/' /etc/containerd/config.toml
grep -n -B2 SystemdCgroup /etc/containerd/config.toml
```

The grep should show `SystemdCgroup = true` under `[plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc.options]`. If the line is missing, add it under that header by hand with `sudo nano /etc/containerd/config.toml`.

4. Restart and check:

```bash
sudo systemctl restart containerd
sudo systemctl enable containerd
systemctl is-active containerd               # active
```

## Step 4: Install kubeadm, kubelet and kubectl

Three programs come from the official Kubernetes package repository (pkgs.k8s.io). Each repository holds one minor version, here v1.37:

| Program | Role |
| --- | --- |
| kubelet | The agent on every node. Starts and watches the pods it is told to run |
| kubeadm | Builds the cluster: certificates, control-plane pods, config files |
| kubectl | The command-line client you use to talk to the cluster |

1. Add the repository:

```bash
K8S=v1.37
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/$K8S/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/$K8S/deb/ /" | sudo tee /etc/apt/sources.list.d/kubernetes.list
```

2. Install and pin the versions so a routine `apt upgrade` never upgrades Kubernetes behind your back (cluster upgrades have their own procedure, see Day-2):

```bash
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
sudo systemctl enable --now kubelet
kubeadm version -o short                      # v1.37.x
```

The kubelet now restarts every few seconds (`systemctl status kubelet` shows it). That is expected: it is waiting for its instructions, which `kubeadm init` writes in the next step.

## Step 5: Create the control plane with kubeadm

`kubeadm init` turns the server into a cluster. It creates the certificates, writes the control-plane components as static pods in `/etc/kubernetes/manifests`, and the kubelet starts them: etcd (the database), the API server, the scheduler and the controller manager.

1. Pull the control-plane images first so you can watch that step on its own:

```bash
sudo kubeadm config images pull
```

2. Create the cluster. `192.168.0.0/16` is the range pods get their IPs from; it is Calico's default in step 6:

```bash
sudo kubeadm init --pod-network-cidr=192.168.0.0/16
```

It takes 1–3 minutes and ends with "Your Kubernetes control-plane has initialized successfully!" plus a `kubeadm join` command. Save that join command somewhere; you only need it if you add a worker later.

3. Give the `deploy` user its kubeconfig (the file that tells kubectl where the cluster is and holds the admin credentials). GitHub Actions uses this same file in step 8:

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

4. Look at what you built:

```bash
kubectl get nodes                  # STATUS NotReady: no pod network yet (step 6)
kubectl get pods -n kube-system    # etcd, kube-apiserver, ... Running; coredns Pending
ls /etc/kubernetes/manifests       # the static pod files kubeadm wrote
```

5. Let ordinary pods run on this node. By default the control plane carries a "taint" that keeps your apps off it, which is right on a big cluster and wrong on a one-node one:

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

Optional comfort: `echo 'source <(kubectl completion bash); alias k=kubectl; complete -o default -F __start_kubectl k' >> ~/.bashrc` gives tab completion and the short `k` command.

If `kubeadm init` fails, read its error, run `sudo kubeadm reset -f`, fix the cause (usually steps 2–3), and run init again.

## Step 6: Add the pod network (Calico)

Kubernetes defines how pods should network but ships no network. A CNI plugin provides it; Calico (v3.33.0 here) gives every pod an IP from `192.168.0.0/16`, routes traffic between pods, and supports NetworkPolicy firewall rules. It also supports `hostPort`, which Traefik uses in step 7.

1. Install the Calico CRDs (new object types) and the Tigera operator, the program that installs and upgrades Calico for you:

```bash
CALICO=v3.33.0
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/$CALICO/manifests/v3_projectcalico_org.yaml
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/$CALICO/manifests/tigera-operator.yaml
kubectl wait --for=condition=Available deployment/tigera-operator -n tigera-operator --timeout=120s
```

2. Tell the operator to install Calico. The default `custom-resources.yaml` uses the same `192.168.0.0/16` range you gave kubeadm:

```bash
curl -fsSLO https://raw.githubusercontent.com/projectcalico/calico/$CALICO/manifests/custom-resources.yaml
grep cidr custom-resources.yaml             # cidr: 192.168.0.0/16
kubectl create -f custom-resources.yaml
```

3. Watch it come up (2–4 minutes). Press Ctrl+C when all pods are Running:

```bash
watch kubectl get pods -n calico-system
kubectl get nodes                           # STATUS Ready
kubectl get pods -n kube-system             # coredns now Running
```

Test the network with a throwaway pod that looks up a service name through CoreDNS:

```bash
kubectl run nettest --rm -it --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default
```

An answer with an address means pods can reach DNS over the pod network.

Check the newest Calico version on the [Calico releases page](https://github.com/projectcalico/calico/releases) before you start, and use it in `CALICO=`.

## Step 7: Install Helm, Traefik and cert-manager

Your cluster runs pods but nothing outside can reach them yet. Two add-ons fix that, both installed with Helm, the package manager for Kubernetes:

- **Traefik** is the ingress controller: it listens on ports 80 and 443 of the server and routes `odiapedia.com` to the Odiapedia pods, following the Ingress in `k8s/base/ingress.yaml`. (The older ingress-nginx project was retired in March 2026, so this guide uses Traefik.)
- **cert-manager** gets free HTTPS certificates from Let's Encrypt and renews them before they expire.

1. Install Helm (v4):

```bash
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-4
chmod 700 get_helm.sh && ./get_helm.sh
helm version
```

2. Install Traefik. A cloud load balancer would normally sit in front of it (DigitalOcean charges $12/month for one); instead, Traefik binds the server's own ports 80 and 443 through `hostPort`. The same settings are in the repo as `k8s/addons/traefik-values.yaml`:

```bash
cat <<EOF > traefik-values.yaml
deployment:
  kind: DaemonSet          # exactly one Traefik pod per node
updateStrategy:
  type: RollingUpdate
  rollingUpdate:
    maxUnavailable: 1      # the old pod must free ports 80/443 before the new one starts
    maxSurge: 0
ports:
  web:
    hostPort: 80
  websecure:
    hostPort: 443
service:
  type: ClusterIP          # no cloud load balancer
ingressClass:
  enabled: true
  isDefaultClass: true     # named "traefik", as k8s/overlays/production expects
EOF
helm repo add traefik https://traefik.github.io/charts
helm repo update
helm install traefik traefik/traefik -n traefik --create-namespace -f traefik-values.yaml --wait
kubectl get pods -n traefik
kubectl get ingressclass                    # traefik (default)
```

On your Mac, `curl -I http://<public_ip>` should now answer `404 Not Found`. That 404 comes from Traefik: it is reachable and has no routes yet.

3. Install cert-manager (v1.21.2 at the time of writing; see the [cert-manager Helm install page](https://cert-manager.io/docs/installation/helm/) for the newest):

```bash
helm install cert-manager oci://quay.io/jetstack/charts/cert-manager \
  --version v1.21.2 \
  --namespace cert-manager --create-namespace \
  --set crds.enabled=true --wait
kubectl get pods -n cert-manager            # 3 pods Running
```

The Let's Encrypt issuer itself (`k8s/cluster/cluster-issuer.yaml`) is applied by the deploy workflow in step 8, together with the app.

`helm list -A` now shows both releases. Helm remembers each install, so later you can run `helm upgrade` or `helm rollback` on them.

## Step 8: Deploy Odiapedia and switch the domain

The cluster is ready; GitHub Actions now does the deploying. On each push it builds the Docker image, stores it in GitHub Container Registry (GHCR), connects to the server over SSH and runs `kubectl apply` with the manifests from `k8s/`.

1. Make the image public (once, after the first build has run): GitHub → your profile → Packages → `odiapedia` → Package settings → Change visibility → Public. It holds only the public website. If you keep it private, create a classic token with only `read:packages` and save it as the secret `GHCR_PULL_TOKEN`.
2. Add the settings in GitHub → repo Settings → Secrets and variables → Actions:

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `DEPLOY_HOST` | the `public_ip` from Terraform |
| Secret | `DEPLOY_SSH_KEY` | the private key: `cat ~/.ssh/odiapedia_deploy` on your Mac |
| Secret (if used) | `TRIP_LEAD_WEBHOOK_URL`, `TRIP_LEAD_WEBHOOK_SECRET` | same values as in Vercel |
| Variable (if used) | `NEXT_PUBLIC_GA_ID` and the two `NEXT_PUBLIC_*_SITE_VERIFICATION` | same values as in Vercel |
| Variable | `K8S_DEPLOY` | `true` |

3. Deploy: Actions → Build and deploy → Run workflow (or push to `main`). Then watch it arrive on the server:

```bash
kubectl get all -n odiapedia
kubectl -n odiapedia logs deploy/odiapedia --tail=20
```

4. Test before touching DNS. On your Mac, pretend to be odiapedia.com:

```bash
curl -sI -H "Host: odiapedia.com" http://<public_ip>/       # HTTP/1.1 200 OK
```

5. Switch the domain. Where odiapedia.com's DNS is managed, replace the Vercel records with **A** records for `odiapedia.com` and `www` pointing at `public_ip`. As soon as Let's Encrypt can reach the server by name, cert-manager gets the certificate:

```bash
kubectl get certificate -n odiapedia        # READY True, usually within 5 minutes of DNS updating
kubectl describe certificate -n odiapedia odiapedia-tls   # if it stays False, the events say why
```

6. Open https://odiapedia.com. When it works, remove the domain from the Vercel project so pushes stop deploying twice.

Rollback is built in. If a new version fails its health checks, the workflow undoes it automatically. To go back on purpose, run the workflow with `image_tag` set to an older tag (for example `sha-1a2b3c4`, listed under Packages → odiapedia); no rebuild needed.

## Day-2: keeping the cluster healthy

Three jobs keep a kubeadm cluster healthy: renewing its certificates every year, upgrading one minor version at a time, and backing up etcd.

### Certificates expire after one year

kubeadm's internal certificates (API server, etcd, admin kubeconfig) are valid for 1 year. A cluster upgrade renews them automatically, so upgrading at least once a year is enough. Check any time:

```bash
sudo kubeadm certs check-expiration
```

To renew without upgrading, run the commands below, then restart the control-plane pods. To restart them, move each file out of `/etc/kubernetes/manifests`, wait 20 seconds, and move it back:

```bash
sudo kubeadm certs renew all
sudo cp /etc/kubernetes/admin.conf $HOME/.kube/config    # kubectl's credentials changed too
```

### Upgrading Kubernetes (one minor version at a time)

New minor versions come out about every 4 months. Go 1.37 → 1.38 → 1.39, never skip one. On a one-node cluster the site is briefly unavailable while the kubelet restarts.

```bash
sudo sed -i 's/v1.37/v1.38/' /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-mark unhold kubeadm && sudo apt-get install -y kubeadm && sudo apt-mark hold kubeadm
sudo kubeadm upgrade plan                 # shows the exact version to use
sudo kubeadm upgrade apply v1.38.X        # X from the plan
sudo apt-mark unhold kubelet kubectl && sudo apt-get install -y kubelet kubectl && sudo apt-mark hold kubelet kubectl
sudo systemctl daemon-reload && sudo systemctl restart kubelet
kubectl get nodes                         # VERSION v1.38.X
```

Upgrade Calico, Traefik and cert-manager separately (`helm upgrade` for the last two) and read each project's notes first.

### Backups

etcd holds the cluster's whole state. Snapshot it, then copy the file to your Mac:

```bash
kubectl -n kube-system exec etcd-$(hostname) -- etcdctl \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  snapshot save /var/lib/etcd/snapshot.db
# on your Mac:
scp deploy@<public_ip>:/var/lib/etcd/snapshot.db ./etcd-$(date +%F).db   # may need: sudo chmod 644 on the server first
```

For this site, the simpler safety net is that everything is in git: Terraform rebuilds the server, steps 2–7 rebuild the cluster, and the workflow redeploys the app. Turning on DigitalOcean droplet backups (+20%, about $4.80/month) adds a whole-disk copy.

### Troubleshooting cheat sheet

| Symptom | Look with |
| --- | --- |
| Node NotReady | `kubectl describe node` (Conditions), `sudo journalctl -u kubelet -n 50` |
| Pod Pending | `kubectl describe pod <name> -n <ns>` (Events at the bottom) |
| Pod CrashLoopBackOff | `kubectl logs <pod> -n <ns> --previous` |
| ImagePullBackOff | `kubectl describe pod`; check the image tag exists and the package is public |
| Site gives 404 | `kubectl get ingress -A`; the host name must match exactly |
| No HTTPS certificate | `kubectl describe certificate -n odiapedia`, `kubectl get challenges -A` |
| Control plane down | `sudo crictl ps -a` (containers without Kubernetes), `ls /etc/kubernetes/manifests` |
| Everything at once | `kubectl get events -A --sort-by=.lastTimestamp \| tail -30` |

Start over cleanly at any point: `sudo kubeadm reset -f`, then `sudo rm -rf /etc/cni/net.d $HOME/.kube`, and repeat from step 5. Or run `terraform destroy` and `terraform apply` for a brand-new server.

## Sources

- [Installing kubeadm](https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/install-kubeadm/) (Kubernetes v1.37)
- [Container runtimes](https://kubernetes.io/docs/setup/production-environment/container-runtimes/) (IP forwarding, systemd cgroup driver)
- [Calico quickstart](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart) (v3.33.0 manifests)
- [Helm install](https://helm.sh/docs/intro/install/) (Helm 4)
- [Traefik on Kubernetes](https://doc.traefik.io/traefik/getting-started/kubernetes/) and [chart values](https://github.com/traefik/traefik-helm-chart/blob/master/traefik/values.yaml)
- [cert-manager Helm install](https://cert-manager.io/docs/installation/helm/) (v1.21.2)
- [Ingress NGINX retirement](https://www.cncf.io/blog/2026/04/02/ingress-nginx-retirement-experience-from-end-users/)
