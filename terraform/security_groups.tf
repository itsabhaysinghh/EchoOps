# ------------------------------------------------------------------------------
# Security Groups for EchoOps (Principle of Least Privilege)
# ------------------------------------------------------------------------------

# 1. Application Load Balancer Security Group
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-${var.environment}-alb-sg"
  description = "Security group for EchoOps public Application Load Balancer"
  vpc_id      = aws_vpc.main.id

  # HTTP Ingress
  ingress {
    description = "Allow inbound HTTP from internet"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS Ingress
  ingress {
    description = "Allow inbound HTTPS from internet"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound to VPC / ECS
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-alb-sg"
  }
}

# 2. ECS Tasks Security Group (FastAPI Backend & Next.js Frontend)
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-${var.environment}-ecs-sg"
  description = "Security group for EchoOps ECS Fargate services"
  vpc_id      = aws_vpc.main.id

  # Ingress from ALB to Backend container port (8000)
  ingress {
    description     = "Allow HTTP traffic from ALB to FastAPI backend"
    from_port       = var.backend_container_port
    to_port         = var.backend_container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Ingress from ALB to Frontend container port (3000)
  ingress {
    description     = "Allow HTTP traffic from ALB to Next.js frontend"
    from_port       = var.frontend_container_port
    to_port         = var.frontend_container_port
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }

  # Inter-task communication within ECS SG
  ingress {
    description = "Allow internal communication between ECS tasks"
    from_port   = 0
    to_port     = 65535
    protocol    = "tcp"
    self        = true
  }

  # Outbound traffic (Outbound to Internet via NAT for AI APIs / Slack / Jira / DB)
  egress {
    description = "Allow all outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-ecs-sg"
  }
}

# 3. RDS PostgreSQL Security Group
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-${var.environment}-rds-sg"
  description = "Security group for EchoOps RDS PostgreSQL instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow PostgreSQL access strictly from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-rds-sg"
  }
}

# 4. ElastiCache Redis Security Group
resource "aws_security_group" "redis" {
  count       = var.enable_redis ? 1 : 0
  name        = "${var.project_name}-${var.environment}-redis-sg"
  description = "Security group for EchoOps Redis cache & queue"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Allow Redis access strictly from ECS tasks"
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
  }

  egress {
    description = "Allow outbound traffic"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-${var.environment}-redis-sg"
  }
}
