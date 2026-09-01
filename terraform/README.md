# 🏗️ EchoOps — Infrastructure as Code (Terraform)

This directory contains the production-ready Terraform infrastructure configuration for deploying the **EchoOps** platform on **AWS** with high availability, security best practices, and auto-scaling.

---

## 🏛️ Architecture Overview

```
                      [ Internet / Users ]
                                │
                                ▼
                   [ Route 53 / Custom Domain ]
                                │
                                ▼
              [ Application Load Balancer (ALB) ]
                     │                   │
         /api/*, /docs      /* (Default)
                     │                   │
                     ▼                   ▼
     ┌───────────────────────┐   ┌───────────────────────┐
     │  ECS Fargate Service  │   │  ECS Fargate Service  │
     │   (FastAPI Backend)   │   │   (Next.js Frontend)  │
     └───────────┬───────────┘   └───────────────────────┘
                 │
       ┌─────────┴─────────┬───────────────────┐
       ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌────────────────┐
│ RDS Postgres │   │ ElastiCache  │   │   S3 Bucket    │
│  (pgvector)  │   │ (Redis Task) │   │ (Voice/Media)  │
└──────────────┘   └──────────────┘   └────────────────┘
```

---

## 📦 Provisioned Resources

| Component | AWS Resource | Purpose |
|---|---|---|
| **Networking** | VPC, 6 Subnets across 2 AZs, NAT Gateway, IGW | Isolated network tiers (Public, Private App, Isolated DB) |
| **Compute** | AWS ECS (Fargate + Fargate Spot) | Serverless container runtime for Backend and Frontend with target-tracking autoscaling |
| **Load Balancing** | Application Load Balancer (ALB) | Path-based routing (`/api/*` ➔ FastAPI, `/*` ➔ Next.js), health checks, SSL termination |
| **Container Registry** | Amazon ECR | Docker image registries with automated vulnerability scanning and lifecycle pruning |
| **Database** | Amazon RDS (PostgreSQL 16) | High-performance relational database with pgvector capability and automated storage scaling |
| **Cache & Queue** | Amazon ElastiCache (Redis 7) | Async background ticket worker queues (Celery) and response caching |
| **Storage** | Amazon S3 | Secure storage for customer voice feedback recordings, ticket attachments, and exports |
| **Security & Secrets** | AWS Secrets Manager & IAM Roles | Least-privilege IAM roles and encrypted secrets for DB passwords & AI API keys |
| **Observability** | AWS CloudWatch | Centralized log groups, latency/error metric alarms, SNS notifications, and Ops Dashboard |

---

## 📁 File Structure

```text
terraform/
├── versions.tf               # Terraform & AWS provider requirements + remote state backend
├── variables.tf              # Parameterized variables with sensible defaults
├── vpc.tf                    # VPC, Subnets (Public, Private, DB), NAT, Gateways
├── security_groups.tf        # Least-privilege security group rules
├── s3.tf                     # S3 media bucket with encryption & lifecycle rules
├── rds.tf                    # PostgreSQL 16 instance + automated password generation
├── elasticache.tf            # Redis cluster for Celery queues & caching
├── iam.tf                    # ECS Task Execution and Task IAM roles
├── ecr.tf                    # ECR repositories for backend & frontend
├── alb.tf                    # Application Load Balancer & path routing rules
├── ecs.tf                    # ECS Cluster, Task Definitions, Services, & Auto Scaling
├── secrets.tf                # Secrets Manager for API keys and JWT signing
├── cloudwatch.tf             # CloudWatch Log groups, alarms & executive dashboard
├── outputs.tf                # Outputs (ALB URL, ECR URLs, RDS endpoint, etc.)
├── terraform.tfvars.example  # Example variable values
└── README.md                 # This documentation file
```

---

## 🚀 How to Deploy (When Ready to Implement)

### 1. Prerequisites
- [AWS CLI v2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) installed and configured with appropriate permissions (`aws configure`).
- [Terraform >= 1.5.0](https://developer.hashicorp.com/terraform/downloads) installed.
- Docker installed for building and pushing container images.

### 2. Configure Variables
Copy the example variables file:
```bash
cp terraform.tfvars.example terraform.tfvars
```
Edit `terraform.tfvars` to set your desired AWS region, domain name, alert email, etc.

### 3. Initialize & Plan
```bash
cd terraform
terraform init
terraform plan -out=tfplan
```

### 4. Build and Push Docker Images to ECR
First, create the ECR repositories (or apply the whole plan):
```bash
# Log in to Amazon ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build and push Backend
docker build -t <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/echoops-backend:latest ../backend
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/echoops-backend:latest

# Build and push Frontend
docker build -t <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/echoops-frontend:latest ../frontend
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/echoops-frontend:latest
```

### 5. Apply Terraform
```bash
terraform apply tfplan
```

### 6. Access EchoOps
Once applied, the command line outputs will display:
- `application_url`: Your public web interface URL.
- `api_docs_url`: FastAPI Swagger documentation.
- `cloudwatch_dashboard_url`: Direct link to your live monitoring dashboard.

---

## 💰 Cost Optimization Tips
- **Single NAT Gateway**: `single_nat_gateway = true` is enabled by default to save on multi-AZ NAT hourly costs.
- **Fargate Spot**: ECS services use `FARGATE_SPOT` capacity provider weights to save up to 70% on compute.
- **T4g Graviton instances**: RDS (`db.t4g.micro`) and Redis (`cache.t4g.micro`) use ARM Graviton for superior price-to-performance.
- **S3 Lifecycle rules**: Automatically transitions older voice recordings to Standard-IA (90d) and Glacier (365d).

---

## 🧹 Teardown
When you need to destroy test environments:
```bash
terraform destroy
```
