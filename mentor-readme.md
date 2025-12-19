# Mentor Guide: Adding New Services to NestJS Monorepo

This guide explains how to add a new microservice to this NestJS monorepo project.

## Prerequisites

- Node.js 20+
- pnpm package manager
- Docker (for containerization)
- Basic understanding of NestJS

## Project Structure

This is a NestJS monorepo with multiple microservices. Each service is located in the `apps/` directory:

```
apps/
├── auth/          # Authentication service (Port: 3000)
├── stock/         # Stock management service (Port: 3001)
└── [new-service]/ # Your new service will go here
```

## Running Existing Services

### Running Services Locally (Development)

#### Run a Specific Service

```bash
# Run auth service in watch mode (auto-reload on changes)
pnpm exec nest start auth --watch

# Run stock service in watch mode
pnpm exec nest start stock --watch

# Run in debug mode
pnpm exec nest start auth --debug --watch
```

**Access the services:**
- Auth service: http://localhost:3000
- Stock service: http://localhost:3001

#### Run All Services Simultaneously

Open multiple terminal windows/tabs:

```bash
# Terminal 1
pnpm exec nest start auth --watch

# Terminal 2
pnpm exec nest start stock --watch
```

### Running Services with Docker

#### Run a Single Service Container

```bash
# Build and run auth service
docker build -f Dockerfile.auth -t auth-app .
docker run -p 3000:3000 auth-app

# Build and run stock service
docker build -f Dockerfile.stock -t stock-app .
docker run -p 3001:3001 stock-app

# Run in detached mode (background)
docker run -d -p 3000:3000 --name auth-container auth-app
```

**Access the services:**
- Auth service: http://localhost:3000
- Stock service: http://localhost:3001

#### Run All Services with Docker Compose

If you have a `docker-compose.yml` file:

```bash
# Build and start all services
docker-compose up --build

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Production Mode (Local)

```bash
# Build the service first
pnpm exec nest build auth

# Run the built service
node dist/apps/auth/main.js
```

### Useful Docker Commands

```bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a running container
docker stop auth-container

# Remove a container
docker rm auth-container

# View container logs
docker logs auth-container

# Follow container logs
docker logs -f auth-container

# Remove all stopped containers
docker container prune
```

## Step-by-Step Guide: Creating a New Service

### Step 1: Generate Service Using NestJS CLI

Use the NestJS CLI to scaffold a new application:

```bash
nest generate app <service-name>
```

**Example:**
```bash
nest generate app payment
```

This creates:
- `apps/payment/src/` - Source code directory
- `apps/payment/test/` - E2E test directory
- `apps/payment/tsconfig.app.json` - TypeScript configuration

### Step 2: Verify Directory Structure

Your new service should have the following structure:

```
apps/payment/
├── src/
│   ├── main.ts
│   ├── payment.controller.ts
│   ├── payment.controller.spec.ts
│   ├── payment.module.ts
│   └── payment.service.ts
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
└── tsconfig.app.json
```

### Step 3: Configure the Service Port

Edit `apps/<service-name>/src/main.ts` to set a unique port:

```typescript
import { NestFactory } from '@nestjs/core';
import { PaymentModule } from './payment.module';

async function bootstrap() {
  const app = await NestFactory.create(PaymentModule);
  await app.listen(3002); // Choose a unique port
}
bootstrap();
```

**Port Assignment:**
- auth: 3000
- stock: 3001
- payment: 3002 (example)
- [your service]: 300X

### Step 4: Update nest-cli.json

Add your new service to the `projects` section in `nest-cli.json`:

```json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "apps/auth/src",
  "compilerOptions": {
    "deleteOutDir": true,
    "webpack": true,
    "tsConfigPath": "apps/auth/tsconfig.app.json"
  },
  "monorepo": true,
  "root": "apps/auth",
  "projects": {
    "auth": {
      "type": "application",
      "root": "apps/auth",
      "entryFile": "main",
      "sourceRoot": "apps/auth/src",
      "compilerOptions": {
        "tsConfigPath": "apps/auth/tsconfig.app.json"
      }
    },
    "stock": {
      "type": "application",
      "root": "apps/stock",
      "entryFile": "main",
      "sourceRoot": "apps/stock/src",
      "compilerOptions": {
        "tsConfigPath": "apps/stock/tsconfig.app.json"
      }
    },
    "payment": {
      "type": "application",
      "root": "apps/payment",
      "entryFile": "main",
      "sourceRoot": "apps/payment/src",
      "compilerOptions": {
        "tsConfigPath": "apps/payment/tsconfig.app.json"
      }
    }
  }
}
```

### Step 5: Test the Service Locally

Build and run your service:

```bash
# Build the service
pnpm exec nest build payment

# Run in development mode
pnpm exec nest start payment --watch

# Or run in production mode
node dist/apps/payment/main.js
```

Test the service:
```bash
curl http://localhost:3002
```

## Creating a Dockerfile for the New Service

### Step 6: Create Dockerfile.<service-name>

Create a new Dockerfile at the project root: `Dockerfile.payment`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools and enable pnpm via corepack
RUN corepack enable

# Copy package metadata and lockfile first for efficient caching
COPY package.json pnpm-lock.yaml nest-cli.json tsconfig.json tsconfig.build.json ./

# Copy app sources
COPQuick Command Reference

### Development Commands

| Task | Command |
|------|---------|
| Generate new service | `nest generate app <service-name>` |
| Build specific service | `pnpm exec nest build <service-name>` |
| Run service (dev mode) | `pnpm exec nest start <service-name> --watch` |
| Run service (debug mode) | `pnpm exec nest start <service-name> --debug --watch` |
| Run service (production) | `node dist/apps/<service-name>/main.js` |
| Install dependencies | `pnpm install` |
| Run tests | `pnpm test` |
| Run e2e tests | `pnpm test:e2e` |

### Docker Commands

| Task | Command |
|------|---------|
| Build Docker image | `docker build -f Dockerfile.<service-name> -t <service-name>-app .` |
| Run Docker container | `docker run -p <port>:<port> <service-name>-app` |
| Run in background | `docker run -d -p <port>:<port> --name <container-name> <service-name>-app` |
| List running containers | `docker ps` |
| Stop container | `docker stop <container-name>` |
| Remove container | `docker rm <container-name>` |
| View logs | `docker logs <container-name>` |
| Follow logs | `docker logs -f <container-name>` |
| Remove image | `docker rmi <service-name>-app` |
| Prune unused containers | `docker container prune` |

### Docker Compose Commands

| Task | Command |
|------|---------|
| Start all services | `docker-compose up` |
| Start in background | `docker-compose up -d` |
| Build and start | `docker-compose up --build` |
| Stop all services | `docker-compose down` |
| View logs | `docker-compose logs` |
| Follow logs | `docker-compose logs -f` |
| View specific service logs | `docker-compose logs <service-name>` |
| Restart a service | `docker-compose restart <service-name>` |
| Scale a service | `docker-compose up --scale <service-name>=3` |se Alpine Linux for minimal image size

### Step 7: Build Docker Image

Build the Docker image:

```bash
docker build -f Dockerfile.payment -t payment-app .
```

**Naming Convention:**
- Dockerfile: `Dockerfile.<service-name>`
- Image tag: `<service-name>-app`

### Step 8: Run Docker Container

Run the container:

```bash
docker run -p 3002:3002 payment-app
```

Test the containerized service:
```bash
curl http://localhost:3002
```

## Docker Compose (Optional)

If you want to orchestrate multiple services, create/update `docker-compose.yml`:

```yaml
version: '3.8'
services:
  auth:
    build:
      context: .
      dockerfile: Dockerfile.auth
    ports:
      - "3000:3000"
    networks:
      - app-network

  stock:
    build:
      context: .
      dockerfile: Dockerfile.stock
    ports:
      - "3001:3001"
    networks:
      - app-network

  payment:
    build:
      context: .
      dockerfile: Dockerfile.payment
    ports:
      - "3002:3002"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

Run all services:
```bash
docker-compose up --build
```

## Checklist for Adding a New Service

- [ ] Generate service using `nest generate app <service-name>`
- [ ] Set unique port in `main.ts`
- [ ] Add service configuration to `nest-cli.json`
- [ ] Test locally with `pnpm exec nest start <service-name> --watch`
- [ ] Create `Dockerfile.<service-name>` at project root
- [ ] Update EXPOSE port and CMD in Dockerfile
- [ ] Build Docker image: `docker build -f Dockerfile.<service-name> -t <service-name>-app .`
- [ ] Test Docker container: `docker run -p <port>:<port> <service-name>-app`
- [ ] Update `docker-compose.yml` if using orchestration
- [ ] Document any service-specific environment variables or configurations

## Common Commands Reference

```bash
# Generate new service
nest generate app <service-name>

# Build specific service
pnpm exec nest build <service-name>

# Run service in dev mode
pnpm exec nest start <service-name> --watch

# Build Docker image
docker build -f Dockerfile.<service-name> -t <service-name>-app .

# Run Docker container
docker run -p <port>:<port> <service-name>-app

# View running containers
docker ps

# Stop container
docker stop <container-id>

# Remove image
docker rmi <service-name>-app
```

## Troubleshooting

### Service won't start
- Check if port is already in use: `lsof -i :<port>`
- Verify `nest-cli.json` configuration
- Ensure `tsconfig.app.json` exists and is properly configured

### Docker build fails
- Ensure all dependencies are in `package.json`
- Check that service name in Dockerfile matches actual service name
- Verify pnpm-lock.yaml is up to date: `pnpm install`

### Port conflicts
- Each service needs a unique port
- Update both `main.ts` and Dockerfile EXPOSE directive
- Update docker-compose.yml port mapping if used

## Best Practices

1. **Consistent Naming**: Use kebab-case for service names (e.g., `user-management`, not `UserManagement`)
2. **Port Management**: Document port assignments in this README
3. **Environment Variables**: Use `.env` files for configuration, never hardcode
4. **Docker Layers**: Order Dockerfile commands to maximize cache efficiency
5. **Testing**: Always test services both locally and in Docker before deployment
6. **Documentation**: Update this guide when adding new patterns or configurations

## Architecture Notes

- Each service is independent and can be deployed separately
- Services communicate via HTTP/REST or message queues (add details as needed)
- Shared code should go in a `libs/` directory (create if needed)
- Use NestJS modules for proper dependency injection and separation of concerns

---

**Last Updated:** December 20, 2025
**Maintainer:** Development Team
