terraform {
  required_version = ">= 1.6"

  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }

  # State is kept locally (terraform.tfstate, git-ignored). When you want it shared or safer,
  # move it to a remote backend, e.g. a DigitalOcean Spaces bucket or Terraform Cloud.
}

provider "digitalocean" {
  # Reads the API token from the DIGITALOCEAN_TOKEN environment variable.
}
