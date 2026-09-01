# ------------------------------------------------------------------------------
# ElastiCache Redis Cluster (Celery / Background Tasks & Caching)
# ------------------------------------------------------------------------------

resource "aws_elasticache_parameter_group" "redis" {
  count       = var.enable_redis ? 1 : 0
  name        = "${var.project_name}-${var.environment}-redis7-params"
  family      = "redis7"
  description = "Custom Redis 7 parameter group for EchoOps"

  parameter {
    name  = "maxmemory-policy"
    value = "allkeys-lru"
  }
}

resource "aws_elasticache_replication_group" "redis" {
  count                      = var.enable_redis ? 1 : 0
  replication_group_id       = "${var.project_name}-${var.environment}-redis"
  description                = "Redis cluster for EchoOps async background queues and cache"
  node_type                  = var.redis_node_type
  num_cache_clusters         = var.redis_num_cache_nodes
  parameter_group_name       = aws_elasticache_parameter_group.redis[0].name
  port                       = 6379
  subnet_group_name          = aws_elasticache_subnet_group.redis[0].name
  security_group_ids         = [aws_security_group.redis[0].id]
  engine                     = "redis"
  engine_version             = "7.1"
  auto_minor_version_upgrade = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = false # Set to true if auth_token is configured

  maintenance_window = "sun:06:00-sun:07:00"
  snapshot_window    = "05:00-06:00"

  tags = {
    Name = "${var.project_name}-${var.environment}-redis"
  }
}
