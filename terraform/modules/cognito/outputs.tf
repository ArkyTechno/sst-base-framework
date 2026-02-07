output "user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = aws_cognito_user_pool.this.id
}

output "app_client_id" {
  description = "The App Client ID for the Cognito User Pool"
  value       = aws_cognito_user_pool_client.this.user_pool_client_id
}
