variable "project_id" {
  type        = string
  description = "GCP project ID"
}

variable "region" {
  type        = string
  default     = "europe-west1"
  description = "GCP region"
}

variable "artifact_repo_name" {
  type        = string
  default     = "cv-scraper-repo"
}

variable "cloud_run_services" {
  type        = list(string)
  default     = ["frontend-service", "backend-service"]
}