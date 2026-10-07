variable "name" {
  description = "Name used for the server and related resources."
  type        = string
  default     = "odiapedia-k3s"
}

variable "region" {
  description = "DigitalOcean region. blr1 = Bangalore, closest to most Odiapedia readers."
  type        = string
  default     = "blr1"
}

variable "size" {
  description = "Droplet size. s-1vcpu-2gb ($12/mo) is enough for k3s + the site; s-2vcpu-4gb ($24/mo) gives more headroom."
  type        = string
  default     = "s-1vcpu-2gb"
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
