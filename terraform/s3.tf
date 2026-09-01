# ------------------------------------------------------------------------------
# S3 Storage for EchoOps (Voice Recordings, Media Attachments, Exports)
# ------------------------------------------------------------------------------

resource "random_id" "bucket_suffix" {
  byte_length = 4
}

resource "aws_s3_bucket" "media" {
  bucket        = "${var.project_name}-${var.environment}-media-${random_id.bucket_suffix.hex}"
  force_destroy = var.environment != "production"

  tags = {
    Name        = "${var.project_name}-${var.environment}-media-storage"
    Description = "Storage for customer voice recordings, attachments, and report exports"
  }
}

# Block all public access by default
resource "aws_s3_bucket_public_access_block" "media" {
  bucket = aws_s3_bucket.media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Server-Side Encryption (AES256)
resource "aws_s3_bucket_server_side_encryption_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Bucket Versioning
resource "aws_s3_bucket_versioning" "media" {
  bucket = aws_s3_bucket.media.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Lifecycle rule to transition/expire old recordings & temp uploads
resource "aws_s3_bucket_lifecycle_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  rule {
    id     = "archive-old-recordings"
    status = "Enabled"

    filter {
      prefix = "recordings/"
    }

    transition {
      days          = 90
      storage_class = "STANDARD_IA"
    }

    transition {
      days          = 365
      storage_class = "GLACIER"
    }
  }

  rule {
    id     = "cleanup-temp-uploads"
    status = "Enabled"

    filter {
      prefix = "temp/"
    }

    expiration {
      days = 7
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

# CORS Configuration (for direct client voice audio uploads via pre-signed URLs)
resource "aws_s3_bucket_cors_configuration" "media" {
  bucket = aws_s3_bucket.media.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = ["*"] # Can be restricted to var.domain_name
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}
