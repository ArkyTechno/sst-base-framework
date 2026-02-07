terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Create the Cognito user pool
resource "aws_cognito_user_pool" "this" {
  name = var.user_pool_name

  # Allow signups with email & verify email
  auto_verified_attributes = []
  username_attributes      = ["email"]

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_uppercase = true
    require_numbers   = true
    require_symbols   = false
  }

  # You can customize further (MFA, email templates, etc.)
}

# Create the app client (no secret for web clients)
resource "aws_cognito_user_pool_client" "this" {
  name            = var.app_client_name
  user_pool_id    = aws_cognito_user_pool.this.id
  generate_secret = false
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_CUSTOM_AUTH",
  ]

  access_token_validity  = 30
  id_token_validity      = 30
  refresh_token_validity = 30

  token_validity_units {
    access_token  = "minutes"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

