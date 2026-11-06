terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.40"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.25"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.28"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.12"
    }
  }

  backend "s3" {
    bucket         = "krishi-saarthi-terraform-state-prod"
    key            = "multi-region/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "krishi-saarthi-terraform-locks"
  }
}

# Primary Region Provider: AWS ap-south-1 (Mumbai)
provider "aws" {
  alias  = "primary"
  region = var.primary_region

  default_tags {
    tags = {
      Project     = "Krishi-Saarthi"
      Environment = var.environment
      Tier        = "FAANG-Planetary"
      ManagedBy   = "Terraform"
    }
  }
}

# Secondary Disaster Recovery Provider: AWS ap-south-2 (Hyderabad)
provider "aws" {
  alias  = "secondary"
  region = var.secondary_region

  default_tags {
    tags = {
      Project     = "Krishi-Saarthi"
      Environment = var.environment
      Tier        = "FAANG-Planetary-DR"
      ManagedBy   = "Terraform"
    }
  }
}

# Cloudflare Edge Provider
provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

