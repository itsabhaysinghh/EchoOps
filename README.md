# EchoOps

<p align="center">
  <img src="https://img.shields.io/badge/Python-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-111827?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Infrastructure-Terraform-7B42BC?style=for-the-badge&logo=terraform&logoColor=white" />
  <img src="https://img.shields.io/badge/Cloud-AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white" />
</p>

**EchoOps is an AI-assisted customer feedback intelligence platform.** It is designed to turn incoming feedback into structured signals that teams can review, prioritize, and route into their engineering workflow.

## The problem

Feedback arrives through disconnected channels such as email, app reviews, support conversations, and voice messages. Manually grouping similar reports and identifying the issues with the greatest customer or business impact is time-consuming.

EchoOps brings those workflows into one place.

## Product capabilities

- Feedback intake and text/audio processing
- Transcription and multilingual text handling
- Sentiment and emotion signals
- Issue categorization and duplicate detection
- Priority and revenue-risk scoring
- Dashboard views for reviewing feedback trends
- Jira and Slack workflow integrations

> These are project capabilities described by the current implementation and project notes. Automated classifications should be reviewed by a person before operational decisions are made.

## Architecture

```text
Feedback sources
      |
      v
Ingestion and text/audio processing
      |
      v
Analysis pipeline
  |-- Translation / transcription
  |-- Sentiment and emotion signals
  |-- Categorization and prioritization
  |-- Duplicate and impact analysis
      |
      v
API + application database
      |
      +------> Web dashboard
      +------> Jira / Slack integrations
```

The repository contains a FastAPI backend, a Next.js frontend, and Terraform infrastructure definitions for AWS.

## Technology

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, TypeScript |
| Backend | Python, FastAPI, SQLAlchemy |
| Data | SQLite / PostgreSQL configuration |
| Infrastructure | Terraform, AWS ECS/Fargate, ALB, RDS, ElastiCache, S3, ECR |
| Operations | AWS Secrets Manager, IAM, CloudWatch |
| Integrations | Jira, Slack |

## Repository layout

```text
EchoOps/
├── backend/       # FastAPI application, dependencies, and backend tests
├── frontend/      # Next.js application
├── terraform/     # AWS infrastructure as code
├── assets/        # Project assets
├── index.html     # Static landing-page entry
├── main.js
└── styles.css
```

## Local development

### Backend

```bash
cd backend
python -m venv .venv
```

Activate the environment, then install dependencies:

```bash
# Windows PowerShell
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Configure the environment variables using the root `.env.example` as a reference. Start the API from the backend directory using the application entry point configured in the project.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Next.js development server normally runs at http://localhost:3000.

## Infrastructure

The `terraform/` directory defines AWS resources for networking, load balancing, container services, database/cache services, storage, secrets, IAM, and monitoring. Review the Terraform README and example variables before planning any deployment.

```bash
cd terraform
terraform init
terraform fmt -check
terraform validate
terraform plan
```

Review the plan and AWS costs carefully before applying infrastructure.

## Testing

Backend test modules are located in `backend/`. Run them from the repository root after installing the backend dependencies and any test-specific requirements:

```bash
python -m pytest backend
```

## Engineering notes

- Treat AI-generated sentiment, categories, and priority scores as decision support, not ground truth.
- Keep API credentials and database passwords in environment variables or a managed secret store.
- Use a non-production environment when testing integrations.
- Verify current Terraform variables and service configuration before deploying.

---

<p align="center"><i>Turning customer feedback into clearer engineering priorities.</i></p>
