
# Terraform Infrastructure

This folder contains Terraform code for **fixed, shared infrastructure** that should **not** be created per SST stage. It exists alongside SST to manage resources that are common across environments (dev, staging, prod) and must remain stable regardless of stage lifecycle.

## Why Terraform in addition to SST?

SST is excellent for stage-scoped resources (API, Lambdas, queues, etc.), but some infrastructure should be **non‑stage dependent** and **long‑lived**. Examples include:

- **Cognito User Pools** shared across multiple stages
- **Identity providers** and OAuth settings
- **Global DNS / hosted zones**
- **Shared secrets or KMS keys**
- **Centralized logging or audit resources**

Using Terraform for these keeps them **stable**, **reusable**, and **safe from accidental stage cleanup**.

## What belongs here?

- Resources that are **environment‑agnostic**
- Anything that should **survive SST stage removal**
- Shared infrastructure used by multiple stages/services

## What should stay in SST?

- Stage-specific APIs and Lambdas
- Per‑stage databases or buckets
- Temporary or test resources tied to a stage lifecycle

## Notes

- Terraform state should be stored in a **remote backend** (e.g., S3 + DynamoDB lock).
- Changes here should be reviewed carefully because they affect **all environments**.

