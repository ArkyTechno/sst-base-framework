# paynwise-app

Serverless API built with SST, Hono, and MongoDB.

## Prerequisites

- Node.js 18+
- AWS credentials configured
- MongoDB connection string for `MONGODB_URI`
- Recomended to run on linux envs for smooth execution of local sst env.

## Setup

```sh
npm install
```

## Development

```sh
npm run dev
```

## Deploy

```sh
npm run deploy
```

## Configuration

- `MONGODB_URI` is required. It is managed as an SST secret in [sst.config.ts](sst.config.ts).

## API

- Base API is created in [sst.config.ts](sst.config.ts).
- Routes are registered via [`initializeLambdas`](src/infra/lambda.handlers.ts) in [src/infra/lambda.handlers.ts](src/infra/lambda.handlers.ts).
- User routes are defined in [`handler`](src/services/user-manage-service/handlers/user.handler.ts) in [src/services/user-manage-service/handlers/user.handler.ts](src/services/user-manage-service/handlers/user.handler.ts).

## Project Structure

- `src/infra`: infrastructure and route registration
- `src/platform`: shared platform utilities (DB, HTTP, logging)
- `src/services`: domain services and handlers

## SST Useful Commands

### Manage Secrets

```sh
# Set a secret (prompted)
npx sst secrets set MONGODB_URI

# Set a secret with value
npx sst secrets set MONGODB_URI "mongodb+srv://user:pass@host/db"

# List secrets
npx sst secrets list

# Remove a secret
npx sst secrets remove MONGODB_URI
```

### Environment & Stacks

```sh
# Start dev environment
npx sst dev

# Deploy to default stage
npx sst deploy

# Deploy to a specific stage
npx sst deploy --stage prod

# Remove a stage
npx sst remove --stage prod
```

### Logs

```sh
# Tail function logs
npx sst logs
```
