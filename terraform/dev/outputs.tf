output "user_pool_id" {
  description = "The ID of the Cognito User Pool"
  value       = module.cognito.user_pool_id
}

output "app_client_id" {
  description = "The Cognito App Client ID"
  value       = module.cognito.app_client_id
}
