output "public_ip" {
  description = "Point odiapedia.com and www.odiapedia.com (A records) here, and use it as the DEPLOY_HOST GitHub secret."
  value       = digitalocean_reserved_ip.public.ip_address
}

output "ssh" {
  description = "Log in to the server."
  value       = "ssh deploy@${digitalocean_reserved_ip.public.ip_address}"
}
