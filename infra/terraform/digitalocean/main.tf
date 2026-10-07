# One DigitalOcean droplet running k3s (a small, complete Kubernetes distribution).
# Everything app-specific lives in /k8s and is the same on any Kubernetes cluster;
# this folder is the only part tied to DigitalOcean.

resource "digitalocean_ssh_key" "deploy" {
  count      = length(var.ssh_public_keys)
  name       = "${var.name}-key-${count.index}"
  public_key = var.ssh_public_keys[count.index]
}

resource "digitalocean_droplet" "node" {
  name       = var.name
  region     = var.region
  size       = var.size
  image      = "ubuntu-24-04-x64"
  monitoring = true
  ssh_keys   = digitalocean_ssh_key.deploy[*].fingerprint
  tags       = ["odiapedia", "k3s"]

  # First-boot setup: deploy user, SSH hardening, swap, k3s and cert-manager.
  user_data = templatefile("${path.module}/cloud-init.yaml.tftpl", {
    ssh_public_keys = var.ssh_public_keys
  })

  lifecycle {
    # Changing the boot script or base image would otherwise destroy and rebuild the server.
    # Remove these from ignore_changes on purpose when you do want a fresh server.
    ignore_changes = [user_data, image, ssh_keys]
  }
}

# A reserved IP stays the same even if the droplet is rebuilt, so DNS never has to change.
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

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.ssh_allowed_cidrs
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }
  inbound_rule {
    protocol         = "icmp"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
