# ------------------------------------------------------------------------------
# Secrets & Environment Configuration in AWS Secrets Manager
# ------------------------------------------------------------------------------

resource "random_password" "jwt_secret" {
  length  = 64
  special = false
}

resource "random_password" "encryption_key" {
  length  = 32
  special = false
}

resource "aws_secretsmanager_secret" "app_secrets" {
  name        = "${var.project_name}-${var.environment}-app-secrets"
  description = "Application runtime secrets (API Keys, JWT Secrets, Webhook URLs)"
}

resource "aws_secretsmanager_secret_version" "app_secrets" {
  secret_id = aws_secretsmanager_secret.app_secrets.id
  secret_string = jsonencode({
    SECRET_KEY          = random_password.jwt_secret.result
    ENCRYPTION_KEY      = random_password.encryption_key.result
    OPENAI_API_KEY      = "replace-with-your-openai-api-key"
    GEMINI_API_KEY      = "replace-with-your-gemini-api-key"
    SLACK_WEBHOOK_URL   = ""
    TEAMS_WEBHOOK_URL   = ""
    GOOGLE_CLIENT_ID    = ""
    GOOGLE_CLIENT_SECRET = ""
    JIRA_API_TOKEN      = ""
    JIRA_DOMAIN         = ""
    JIRA_USER_EMAIL     = ""
  })

  # Ignore changes so future manual updates in AWS console or CI/CD aren't overwritten
  lifecycle {
    ignore_changes = [secret_string]
  }
}
