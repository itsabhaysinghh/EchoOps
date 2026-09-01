terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.5"
    }
  }

  # Uncomment to store state in AWS S3 with DynamoDB state locking
  # backend "s3" {
  #   bucket         = "echoops-terraform-state-bucket"
  #   key            = "environments/prod/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "echoops-terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = merge(
      {
        Project     = var.project_name
        Environment = var.environment
        ManagedBy   = "Terraform"
      },
      var.tags
    )
  }
}
