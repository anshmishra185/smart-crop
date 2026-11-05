# Multi-AZ RDS PostgreSQL 16 (Primary - Mumbai)
resource "aws_db_subnet_group" "primary_db_subnets" {
  provider   = aws.primary
  name       = "krishi-saarthi-primary-db-subnets"
  subnet_ids = [aws_subnet.primary_db_a.id, aws_subnet.primary_db_b.id]
}

resource "aws_kms_key" "primary_rds_kms" {
  provider                = aws.primary
  description             = "KMS Key for RDS storage encryption - Mumbai"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_db_instance" "primary_postgres" {
  provider               = aws.primary
  identifier             = "krishi-saarthi-prod-postgres-primary"
  engine                 = "postgres"
  engine_version         = "16.2"
  instance_class         = var.db_instance_class
  allocated_storage      = 250
  max_allocated_storage  = 2000
  storage_type           = "gp3"
  storage_encrypted      = true
  kms_key_id             = aws_kms_key.primary_rds_kms.arn
  multi_az               = true
  db_name                = "krishi_saarthi"
  username               = "krishi_admin"
  db_subnet_group_name   = aws_db_subnet_group.primary_db_subnets.name
  vpc_security_group_ids = [aws_security_group.primary_db_sg.id]

  backup_retention_period   = 35
  backup_window             = "19:00-20:00"
  maintenance_window        = "sun:21:00-sun:22:00"
  deletion_protection       = true
  auto_minor_version_upgrade = true
  skip_final_snapshot       = false
  final_snapshot_identifier = "krishi-saarthi-final-snapshot"

  performance_insights_enabled          = true
  performance_insights_retention_period = 731 # FAANG 2-year compliance audit
}

# Cross-Region Asynchronous Read Replica in Hyderabad (ap-south-2)
resource "aws_kms_key" "secondary_rds_kms" {
  provider                = aws.secondary
  description             = "KMS Key for RDS storage encryption - Hyderabad DR"
  deletion_window_in_days = 30
  enable_key_rotation     = true
}

resource "aws_db_instance" "dr_replica_postgres" {
  provider            = aws.secondary
  identifier          = "krishi-saarthi-dr-postgres-hyderabad"
  replicate_source_db = aws_db_instance.primary_postgres.arn
  instance_class      = var.db_instance_class
  storage_type        = "gp3"
  storage_encrypted   = true
  kms_key_id          = aws_kms_key.secondary_rds_kms.arn
  multi_az            = true
  auto_minor_version_upgrade = true
  skip_final_snapshot = true

  performance_insights_enabled = true
}
