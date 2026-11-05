variable "environment" {
  description = "Target deployment environment (production, staging)"
  type        = string
  default     = "production"
}

variable "primary_region" {
  description = "Primary AWS region for active traffic"
  type        = string
  default     = "ap-south-1" # AWS Asia Pacific (Mumbai)
}

variable "secondary_region" {
  description = "Disaster recovery / secondary AWS region"
  type        = string
  default     = "ap-south-2" # AWS Asia Pacific (Hyderabad)
}

variable "domain_name" {
  description = "Apex domain name for Krishi Saarthi"
  type        = string
  default     = "krishisaarthi.in"
}

variable "cloudflare_api_token" {
  description = "Cloudflare API token with DNS & Zone WAF edit permissions"
  type        = string
  sensitive   = true
  default     = ""
}

variable "cloudflare_zone_id" {
  description = "Cloudflare Zone ID for krishisaarthi.in"
  type        = string
  default     = ""
}

variable "eks_node_instance_types" {
  description = "EC2 instance types for EKS managed node groups"
  type        = list(string)
  default     = ["c6i.2xlarge", "m6i.2xlarge"]
}

variable "db_instance_class" {
  description = "RDS PostgreSQL primary instance tier"
  type        = string
  default     = "db.r6g.xlarge"
}

variable "redis_node_type" {
  description = "ElastiCache Redis node type"
  type        = string
  default     = "cache.m6g.large"
}
