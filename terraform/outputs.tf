# ------------------------------------------------------------------------------
# Terraform Outputs
# ------------------------------------------------------------------------------

output "alb_dns_name" {
  description = "Public DNS URL of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "application_url" {
  description = "EchoOps Application URL (HTTP / Custom Domain)"
  value       = var.domain_name != "" ? "https://${var.domain_name}" : "http://${aws_lb.main.dns_name}"
}

output "api_docs_url" {
  description = "FastAPI Interactive API Documentation URL"
  value       = var.domain_name != "" ? "https://${var.domain_name}/docs" : "http://${aws_lb.main.dns_name}/docs"
}

output "ecr_backend_repository_url" {
  description = "ECR repository URL for FastAPI backend container images"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_repository_url" {
  description = "ECR repository URL for Next.js frontend container images"
  value       = aws_ecr_repository.frontend.repository_url
}

output "s3_media_bucket_name" {
  description = "S3 bucket for voice recordings, audio feedback & ticket attachments"
  value       = aws_s3_bucket.media.bucket
}

output "rds_endpoint" {
  description = "PostgreSQL database connection endpoint"
  value       = aws_db_instance.postgres.address
}

output "rds_port" {
  description = "PostgreSQL database port"
  value       = aws_db_instance.postgres.port
}

output "redis_endpoint" {
  description = "ElastiCache Redis primary endpoint for task queues and caching"
  value       = var.enable_redis ? aws_elasticache_replication_group.redis[0].primary_endpoint_address : "N/A"
}

output "cloudwatch_dashboard_url" {
  description = "Direct URL to CloudWatch monitoring dashboard"
  value       = "https://${var.aws_region}.console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}

output "secrets_manager_arn" {
  description = "ARN of Secrets Manager storing API keys and JWT secret"
  value       = aws_secretsmanager_secret.app_secrets.arn
}

output "db_credentials_secret_arn" {
  description = "ARN of Secrets Manager storing RDS master credentials"
  value       = aws_secretsmanager_secret.db_credentials.arn
}
