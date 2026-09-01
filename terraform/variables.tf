variable "aws_region" {
  description = "AWS region to deploy resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
  default     = "production"
}

variable "project_name" {
  description = "Project name identifier for resource naming and tagging"
  type        = string
  default     = "echoops"
}

variable "domain_name" {
  description = "Optional custom domain name for EchoOps (e.g. echoops.example.com)"
  type        = string
  default     = ""
}

variable "acm_certificate_arn" {
  description = "Optional ACM certificate ARN for HTTPS listener on ALB"
  type        = string
  default     = ""
}

# ------------------------------------------------------------------------------
# Networking / VPC
# ------------------------------------------------------------------------------
variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b"]
}

variable "public_subnet_cidrs" {
  description = "CIDR blocks for public subnets"
  type        = list(string)
  default     = ["10.0.1.0/24", "10.0.2.0/24"]
}

variable "private_subnet_cidrs" {
  description = "CIDR blocks for private app subnets (ECS containers)"
  type        = list(string)
  default     = ["10.0.10.0/24", "10.0.11.0/24"]
}

variable "database_subnet_cidrs" {
  description = "CIDR blocks for isolated database subnets (RDS & Redis)"
  type        = list(string)
  default     = ["10.0.20.0/24", "10.0.21.0/24"]
}

variable "single_nat_gateway" {
  description = "Use a single NAT Gateway across all AZs to reduce costs (set false in production for high availability)"
  type        = bool
  default     = true
}

# ------------------------------------------------------------------------------
# ECS / Compute
# ------------------------------------------------------------------------------
variable "backend_cpu" {
  description = "CPU units for the FastAPI backend task (256, 512, 1024, etc.)"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory (in MB) for the FastAPI backend task (512, 1024, 2048, etc.)"
  type        = number
  default     = 1024
}

variable "backend_desired_count" {
  description = "Initial number of backend ECS task instances"
  type        = number
  default     = 2
}

variable "backend_min_count" {
  description = "Minimum number of backend task instances for autoscaling"
  type        = number
  default     = 1
}

variable "backend_max_count" {
  description = "Maximum number of backend task instances for autoscaling"
  type        = number
  default     = 6
}

variable "backend_container_port" {
  description = "Port exposed by FastAPI backend container"
  type        = number
  default     = 8000
}

variable "frontend_cpu" {
  description = "CPU units for the Next.js frontend task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory (in MB) for the Next.js frontend task"
  type        = number
  default     = 512
}

variable "frontend_desired_count" {
  description = "Initial number of frontend ECS task instances"
  type        = number
  default     = 2
}

variable "frontend_min_count" {
  description = "Minimum number of frontend task instances for autoscaling"
  type        = number
  default     = 1
}

variable "frontend_max_count" {
  description = "Maximum number of frontend task instances for autoscaling"
  type        = number
  default     = 4
}

variable "frontend_container_port" {
  description = "Port exposed by Next.js frontend container"
  type        = number
  default     = 3000
}

variable "backend_image" {
  description = "Container image for backend (if using existing registry or prebuilt image; defaults to ECR repo created by Terraform)"
  type        = string
  default     = ""
}

variable "frontend_image" {
  description = "Container image for frontend (if using existing registry or prebuilt image; defaults to ECR repo created by Terraform)"
  type        = string
  default     = ""
}

# ------------------------------------------------------------------------------
# RDS PostgreSQL
# ------------------------------------------------------------------------------
variable "db_instance_class" {
  description = "Instance type for RDS PostgreSQL"
  type        = string
  default     = "db.t4g.micro"
}

variable "db_allocated_storage" {
  description = "Allocated storage in GB for RDS"
  type        = number
  default     = 20
}

variable "db_max_allocated_storage" {
  description = "Maximum auto-scaling storage limit in GB for RDS"
  type        = number
  default     = 100
}

variable "db_name" {
  description = "PostgreSQL database name for EchoOps"
  type        = string
  default     = "echoops"
}

variable "db_username" {
  description = "Master username for PostgreSQL database"
  type        = string
  default     = "echoops_admin"
}

variable "db_multi_az" {
  description = "Enable Multi-AZ deployment for RDS PostgreSQL"
  type        = bool
  default     = false
}

variable "db_deletion_protection" {
  description = "Prevent accidental deletion of RDS database"
  type        = bool
  default     = false
}

# ------------------------------------------------------------------------------
# ElastiCache Redis
# ------------------------------------------------------------------------------
variable "enable_redis" {
  description = "Whether to provision an AWS ElastiCache Redis cluster for task queues and caching"
  type        = bool
  default     = true
}

variable "redis_node_type" {
  description = "Node type for ElastiCache Redis"
  type        = string
  default     = "cache.t4g.micro"
}

variable "redis_num_cache_nodes" {
  description = "Number of cache nodes in Redis cluster"
  type        = number
  default     = 1
}

# ------------------------------------------------------------------------------
# Monitoring & Logging
# ------------------------------------------------------------------------------
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 30
}

variable "alarm_email" {
  description = "Email address for CloudWatch alarm notifications (SNS topic)"
  type        = string
  default     = ""
}

# ------------------------------------------------------------------------------
# Custom Tags
# ------------------------------------------------------------------------------
variable "tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
