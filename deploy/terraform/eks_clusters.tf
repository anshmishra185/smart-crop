# Primary EKS Cluster in Mumbai (ap-south-1)
resource "aws_kms_key" "primary_eks_secrets" {
  provider                = aws.primary
  description             = "KMS Key for EKS envelope secrets encryption - Mumbai"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_eks_cluster" "primary" {
  provider = aws.primary
  name     = "krishi-saarthi-prod-mumbai"
  version  = "1.29"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids              = [aws_subnet.primary_priv_a.id, aws_subnet.primary_priv_b.id, aws_subnet.primary_priv_c.id]
    endpoint_private_access = true
    endpoint_public_access  = true
    public_access_cidrs     = ["103.0.0.0/8"] # Restricted to corporate / zero-trust VPN CIDRs
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.primary_eks_secrets.arn
    }
    resources = ["secrets"]
  }

  enabled_cluster_log_types = ["api", "audit", "authenticator", "controllerManager", "scheduler"]
}

resource "aws_eks_node_group" "primary_compute" {
  provider        = aws.primary
  cluster_name    = aws_eks_cluster.primary.name
  node_group_name = "ng-infer-backend-mumbai"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = [aws_subnet.primary_priv_a.id, aws_subnet.primary_priv_b.id, aws_subnet.primary_priv_c.id]

  scaling_config {
    desired_size = 6
    max_size     = 40
    min_size     = 3
  }

  instance_types = var.eks_node_instance_types
  capacity_type  = "ON_DEMAND"
  disk_size      = 100

  labels = {
    workload = "krishi-saarthi-microservices"
    tier     = "production"
  }
}

# Secondary EKS Cluster in Hyderabad (ap-south-2)
resource "aws_kms_key" "secondary_eks_secrets" {
  provider                = aws.secondary
  description             = "KMS Key for EKS envelope secrets encryption - Hyderabad"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_eks_cluster" "secondary" {
  provider = aws.secondary
  name     = "krishi-saarthi-dr-hyderabad"
  version  = "1.29"
  role_arn = aws_iam_role.eks_cluster_role.arn

  vpc_config {
    subnet_ids              = [aws_subnet.sec_priv_a.id, aws_subnet.sec_priv_b.id]
    endpoint_private_access = true
    endpoint_public_access  = true
  }

  encryption_config {
    provider {
      key_arn = aws_kms_key.secondary_eks_secrets.arn
    }
    resources = ["secrets"]
  }
}

resource "aws_eks_node_group" "secondary_compute" {
  provider        = aws.secondary
  cluster_name    = aws_eks_cluster.secondary.name
  node_group_name = "ng-infer-backend-hyderabad"
  node_role_arn   = aws_iam_role.eks_node_role.arn
  subnet_ids      = [aws_subnet.sec_priv_a.id, aws_subnet.sec_priv_b.id]

  scaling_config {
    desired_size = 2
    max_size     = 30
    min_size     = 2
  }

  instance_types = var.eks_node_instance_types
}
