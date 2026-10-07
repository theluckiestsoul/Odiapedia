# Terraform by hand

You will write the Terraform for Odiapedia's server yourself, one file and one resource at a time, running `plan` and `apply` after each. When you finish you will have the same server as `infra/terraform/digitalocean` in the repo, which serves as the answer key. Plan on about 45 minutes.

## How Terraform works

You describe the infrastructure you want in `.tf` files. Terraform compares that with what exists and makes only the changes needed to match.

| Idea | What it means here |
| --- | --- |
| Provider | A plugin that talks to one platform's API: `digitalocean/digitalocean` here, `hashicorp/google` for GCP |
| Resource | One thing to create: an SSH key, a droplet, a firewall. Written `resource "<type>" "<name>" { ... }` |
| Variable | An input you set per environment (region, size, keys), kept out of the code |
| Output | A value Terraform prints after `apply`, such as the server's IP |
| State | `terraform.tfstate`: Terraform's record of what it created and the IDs, so it can change or delete it later |
| Plan / apply | `plan` shows the changes without making them; `apply` makes them after you type `yes` |

The loop you will repeat in every step: edit a `.tf` file → `terraform fmt` → `terraform validate` → `terraform plan` → read the plan → `terraform apply`.

Cost while practising: the droplet is billed by the hour (about $0.036/hour for `s-2vcpu-4gb`), so creating and destroying it a few times costs a few cents. The SSH keys and the firewall are free. A reserved IP is free while it is attached to a droplet; DigitalOcean charges for one left unattached.

## T1: Install Terraform and set up a practice folder

All commands in this guide run on your Mac, in the Odiapedia folder.

1. Install Terraform from HashiCorp's Homebrew tap and check it:

```bash
brew tap hashicorp/tap
brew install hashicorp/tap/terraform
terraform -version
```

2. Create a DigitalOcean API token: DigitalOcean → API → Tokens → Generate New Token, with read and write scope. Copy it now, because it is shown only once. Give it to Terraform through an environment variable, so it never sits in a file:

```bash
export DIGITALOCEAN_TOKEN=dop_v1_xxx      # needed again in every new terminal window
```

3. Make your own folder next to the finished one, and tell git never to commit state or secrets from it. State files can contain sensitive values:

```bash
mkdir -p infra/terraform/my-droplet && cd infra/terraform/my-droplet
cat > .gitignore <<'EOF'
.terraform/
*.tfstate
*.tfstate.*
terraform.tfvars
EOF
```

You will type every file in `my-droplet` yourself. Whenever you get stuck, compare with the answer key: `diff -u ../digitalocean/main.tf main.tf`.

## T2: First file: the provider

Every Terraform project starts by naming the providers it needs and their versions. Create `versions.tf`:

```hcl
terraform {
  required_version = ">= 1.6"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"          # any 2.x, never a breaking 3.0
    }
  }
}

provider "digitalocean" {
  # The token comes from the DIGITALOCEAN_TOKEN environment variable.
}
```

Now initialise the folder:

```bash
terraform init
ls -a                 # .terraform/ and .terraform.lock.hcl appeared
```

`init` downloads the provider into `.terraform/` (git-ignored). `.terraform.lock.hcl` records the exact provider version and checksums; commit it, so you and GitHub Actions use the same provider.

Check your work with the two commands you will use after every edit:

```bash
terraform fmt         # fixes indentation and alignment
terraform validate    # Success! The configuration is valid.
```

`terraform plan` now says "No changes": you have declared a provider but no resources yet.

## T3: First resource: your SSH keys

Start with something small, free and harmless: uploading your SSH public keys to DigitalOcean. You need two: your own key, and the GitHub Actions key from step 1 of [KUBERNETES-SETUP.md](KUBERNETES-SETUP.md) (`~/.ssh/odiapedia_deploy`).

1. Declare the inputs in `variables.tf`:

```hcl
variable "name" {
  description = "Name used for the server and related resources."
  type        = string
  default     = "odiapedia-k8s"
}

variable "ssh_public_keys" {
  description = "Public keys allowed to log in as the deploy user."
  type        = list(string)
  # no default: Terraform asks for it, or reads terraform.tfvars
}
```

2. Give them values in `terraform.tfvars`. Terraform reads this file automatically, and your `.gitignore` keeps it out of git:

```hcl
ssh_public_keys = [
  "ssh-ed25519 AAAA... you@mac",                  # cat ~/.ssh/id_ed25519.pub
  "ssh-ed25519 AAAA... github-actions-deploy",    # cat ~/.ssh/odiapedia_deploy.pub
]
```

3. Create one key resource per list item in `main.tf`. `count` repeats a resource; `count.index` is 0, then 1:

```hcl
resource "digitalocean_ssh_key" "deploy" {
  count      = length(var.ssh_public_keys)
  name       = "${var.name}-key-${count.index}"
  public_key = var.ssh_public_keys[count.index]
}
```

4. Plan, read, apply:

```bash
terraform fmt && terraform validate
terraform plan        # Plan: 2 to add, 0 to change, 0 to destroy.
terraform apply       # shows the plan again; type yes
```

In the plan, `+` means create. Values marked `(known after apply)`, such as the key's `fingerprint`, come from DigitalOcean once the resource exists.

5. Look at the state, and at the same keys in DigitalOcean (Settings → Security):

```bash
terraform state list                                # digitalocean_ssh_key.deploy[0], [1]
terraform state show 'digitalocean_ssh_key.deploy[0]'
```

Run `terraform plan` once more. It says "No changes", because what exists now matches what you wrote. That match is the whole point of Terraform.

## T4: The droplet

Now the real server. It boots with a cloud-init script that creates the `deploy` user and locks SSH down to keys only, nothing else.

1. Add two variables to `variables.tf`:

```hcl
variable "region" {
  description = "blr1 = Bangalore, closest to most Odiapedia readers."
  type        = string
  default     = "blr1"
}

variable "size" {
  description = "kubeadm needs 2 CPUs and 2 GB RAM or more."
  type        = string
  default     = "s-2vcpu-4gb"
}
```

2. Create the first-boot script `cloud-init.yaml.tftpl`. It is a template: the `%{ for }` loop writes one line per key in your list:

```yaml
#cloud-config
package_update: true
package_upgrade: true
packages:
  - unattended-upgrades   # automatic security updates
  - fail2ban              # blocks repeated failed SSH logins

users:
  - name: deploy
    groups: [sudo]
    shell: /bin/bash
    sudo: "ALL=(ALL) NOPASSWD:ALL"
    ssh_authorized_keys:
%{ for key in ssh_public_keys ~}
      - "${key}"
%{ endfor ~}

ssh_pwauth: false
disable_root: true

write_files:
  - path: /etc/ssh/sshd_config.d/90-odiapedia.conf
    content: |
      PermitRootLogin no
      PasswordAuthentication no

runcmd:
  - systemctl restart ssh
```

Preview what the server will receive: run `terraform console`, type `templatefile("cloud-init.yaml.tftpl", { ssh_public_keys = var.ssh_public_keys })`, then `exit`.

3. Add the droplet to `main.tf`. The `digitalocean_ssh_key.deploy[*].fingerprint` reference does two things: it hands over the key fingerprints, and it tells Terraform to create the keys before the droplet:

```hcl
resource "digitalocean_droplet" "node" {
  name       = var.name
  region     = var.region
  size       = var.size
  image      = "ubuntu-24-04-x64"
  monitoring = true
  ssh_keys   = digitalocean_ssh_key.deploy[*].fingerprint
  tags       = ["odiapedia", "kubernetes"]

  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    ssh_public_keys = var.ssh_public_keys
  })
}
```

4. Print the IP after `apply`, in `outputs.tf`:

```hcl
output "droplet_ip" {
  value = digitalocean_droplet.node.ipv4_address
}
```

5. Apply (about 1 minute), wait about 2 more minutes for first boot, then log in:

```bash
terraform plan        # Plan: 1 to add
terraform apply
terraform output droplet_ip
ssh deploy@$(terraform output -raw droplet_ip)
sudo cloud-init status --wait    # on the server: status: done
```

The droplet now costs money by the hour. If you stop for the day, run `terraform destroy` and later `terraform apply` again; that is what Terraform is for.

## T5: A fixed IP and a firewall

The droplet's own IP changes if the droplet is ever rebuilt, and odiapedia.com's DNS will point at it. A reserved IP stays the same whatever happens to the droplet. The firewall closes every port except SSH and the website.

1. Append to `main.tf`. A reserved IP and its assignment to the droplet are two separate resources:

```hcl
resource "digitalocean_reserved_ip" "public" {
  region = var.region
}

resource "digitalocean_reserved_ip_assignment" "public" {
  ip_address = digitalocean_reserved_ip.public.ip_address
  droplet_id = digitalocean_droplet.node.id
}

resource "digitalocean_firewall" "node" {
  name        = "${var.name}-fw"
  droplet_ids = [digitalocean_droplet.node.id]

  inbound_rule {                     # SSH: you and GitHub Actions (keys only)
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {                     # the website
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {                    # the server may reach anything (apt, images, Let's Encrypt)
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
```

The Kubernetes API port (6443) stays closed to the internet. You and GitHub Actions run kubectl on the server itself, over SSH.

2. Replace `outputs.tf` with outputs for the fixed IP:

```hcl
output "public_ip" {
  description = "Point odiapedia.com here; also the DEPLOY_HOST GitHub secret."
  value       = digitalocean_reserved_ip.public.ip_address
}

output "ssh" {
  value = "ssh deploy@${digitalocean_reserved_ip.public.ip_address}"
}
```

3. Plan and apply. Only the new parts are added; the droplet is untouched:

```bash
terraform plan        # Plan: 3 to add, 0 to change, 0 to destroy.
terraform apply
ssh deploy@$(terraform output -raw public_ip)
```

See the order Terraform works out from your references: `terraform graph | grep -- '->'` lists each "needs" link. For example, the assignment needs both the reserved IP and the droplet.

## T6: Change, replace and destroy

The skill that matters most is reading a plan before you type `yes`. Each line starts with a symbol:

| Symbol | Meaning | Risk |
| --- | --- | --- |
| `+` | create | none |
| `~` | update in place | low: the resource keeps its ID |
| `-/+` | destroy, then create a replacement | high: a droplet loses its disk and everything installed on it |
| `-` | destroy | high |

Try each one:

1. **Update in place.** Add `"learning"` to the droplet's `tags`, then run `terraform plan`: `~ tags` and `1 to change`. Apply it, then remove the tag again.
2. **A change that forces replacement.** Add a line to `cloud-init.yaml.tftpl`, for example `   - htop ` under `packages`. `terraform plan` now shows `-/+` and `# forces replacement` next to `user_data`, because cloud-init only runs on first boot. **Don't apply.** Once Kubernetes is installed, that would wipe the cluster. Instead, tell Terraform to ignore such edits by adding this inside the droplet resource:

```hcl
  lifecycle {
    ignore_changes = [user_data, image, ssh_keys]
  }
```

`terraform plan` is quiet again. When you do want a brand-new server, say so explicitly: `terraform apply -replace=digitalocean_droplet.node`. The reserved IP moves to the new droplet automatically.

3. **Drift.** In the DigitalOcean dashboard, add a tag to the droplet by hand. `terraform plan -refresh-only` reports what changed outside Terraform; a normal `terraform plan` offers to put it back. Rule: change Terraform-managed things only through Terraform.
4. **Destroy and rebuild.** `terraform destroy` lists everything it will delete; type `yes`. Then `terraform apply` brings it all back in about 3 minutes. Destroy deletes the reserved IP too, so after a rebuild check `terraform output public_ip` and update DNS if it changed.

Looking after the state file:

- Never edit or delete `terraform.tfstate` by hand. Without it, Terraform forgets what it created, and you would have to delete things in the dashboard yourself.
- Back it up (Time Machine is enough for now). The next level is a remote backend, such as a DigitalOcean Spaces bucket or HCP Terraform: the state lives online with locking, and GitHub Actions could run Terraform too.
- Never commit it. It is in `.gitignore` for that reason.

When you are done practising, choose one folder for the real server. Either keep using `my-droplet` (its `public_ip` output is what KUBERNETES-SETUP.md expects), or run `terraform destroy` here and `terraform apply` in `infra/terraform/digitalocean`. Running both means paying for two servers.

## Command cheat sheet

| Command | What it does |
| --- | --- |
| `terraform init` | Downloads providers; run once per folder, and after changing `versions.tf` |
| `terraform fmt` | Formats your `.tf` files |
| `terraform validate` | Checks syntax and references without calling DigitalOcean |
| `terraform plan` | Shows what would change; changes nothing |
| `terraform apply` | Makes the changes after you type `yes` |
| `terraform apply -replace=<address>` | Rebuilds one resource on purpose |
| `terraform plan -refresh-only` | Shows changes made outside Terraform (drift) |
| `terraform output` / `-raw <name>` | Prints outputs, for example the IP |
| `terraform state list` / `state show <address>` | What Terraform manages, and its recorded details |
| `terraform console` | Try expressions and templates interactively |
| `terraform graph` | The dependency graph between resources |
| `terraform destroy` | Deletes everything in this folder's state |

## Sources

- [Install Terraform](https://developer.hashicorp.com/terraform/install) (HashiCorp)
- [DigitalOcean provider docs](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs): droplet, reserved IP, firewall, SSH key resources
- [Terraform language: lifecycle](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle) (`ignore_changes`, `-replace`)
- Answer key in the repo: `infra/terraform/digitalocean/`
