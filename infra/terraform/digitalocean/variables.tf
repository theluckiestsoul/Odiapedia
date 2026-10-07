variable "name" {
  description = "Name used for the server and related resources."
  type        = string
  default     = "odiapedia-k8s"
}

variable "region" {
  description = "DigitalOcean region. blr1 = Bangalore, closest to most Odiapedia readers."
  type        = string
  default     = "blr1"
}

variable "size" {
  description = "Droplet size. kubeadm needs at least 2 CPUs and 2 GB RAM: s-2vcpu-4gb ($24/mo)."
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "ssh_public_keys" {
  description = "Public SSH keys allowed to log in as the 'deploy' user: your own key and the GitHub Actions deploy key."
  type        = list(string)
}

variable "ssh_allowed_cidrs" {
  description = "Who may reach SSH (port 22). GitHub Actions runners use changing IPs, so the default is open; login is key-only."
  type        = list(string)
  default     = ["0.0.0.0/0", "::/0"]
}
