module "cognito" {
  source          = "../modules/cognito"
  aws_region      = "ap-southeast-1"
  user_pool_name  = "arkytechno-launchpad-user-pool-dev"
  app_client_name = "arkytechno-launchpad-client-dev"
}
