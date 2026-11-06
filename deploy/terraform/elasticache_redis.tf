# ElastiCache Redis 7 Cluster with Auto-Failover (Mumbai Primary)
resource "aws_elasticache_subnet_group" "redis_subnets" {
  provider   = aws.primary
  name       = "krishi-saarthi-redis-subnet-group"
  subnet_ids = [aws_subnet.primary_priv_a.id, aws_subnet.primary_priv_b.id]
}

resource "aws_elasticache_replication_group" "redis_cluster" {
  provider                    = aws.primary
  replication_group_id        = "krishi-saarthi-redis-prod"
  description                 = "Redis 7 Cluster for rate limiting, idempotency and XFetch caching"
  engine                      = "redis"
  engine_version              = "7.1"
  node_type                   = var.redis_node_type
  num_cache_clusters          = 3
  parameter_group_name        = "default.redis7.cluster.on"
  port                        = 6379
  subnet_group_name           = aws_elasticache_subnet_group.redis_subnets.name
  security_group_ids          = [aws_security_group.redis_sg.id]
  automatic_failover_enabled  = true
  multi_az_enabled            = true
  at_rest_encryption_enabled  = true
  transit_encryption_enabled  = true
  auth_token                  = var.redis_auth_token

  maintenance_window       = "sun:22:00-sun:23:00"
  snapshot_retention_limit = 7
  snapshot_window          = "18:00-19:00"
}

