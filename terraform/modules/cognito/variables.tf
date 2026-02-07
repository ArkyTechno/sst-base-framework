variable "aws_region" {
  description = "AWS region to deploy Cognito"
  type        = string
}

variable "user_pool_name" {
  description = "The name for the Cognito User Pool"
  type        = string
}

variable "app_client_name" {
  description = "The name of the Cognito User Pool app client"
  type        = string
}
