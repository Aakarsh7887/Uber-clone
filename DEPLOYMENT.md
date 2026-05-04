# Uber Clone - MERN Stack Application

A modern ride-sharing application built with MongoDB, Express, React, and Node.js.

## 📋 Table of Contents

- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Development](#development)
- [Docker Deployment](#docker-deployment)
- [Jenkins CI/CD Pipeline](#jenkins-cicd-pipeline)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 📁 Project Structure

```
.
├── backend/              # Express server with MongoDB
├── frontend/             # React application
├── docker-compose.yml    # Docker container orchestration
├── Jenkinsfile          # Jenkins CI/CD pipeline
└── .env.example         # Environment variables template
```

## 🔧 Prerequisites

### For Local Development

- Node.js 18+ (LTS)
- npm 8+
- MongoDB 6+
- Git

### For Docker Deployment

- Docker 20.10+
- Docker Compose 1.29+
- 4GB RAM minimum
- 2 CPU cores minimum

### For Jenkins Deployment

- Jenkins 2.361+
- Docker plugin
- Pipeline plugin
- Git plugin

## 🚀 Setup Instructions

### 1. Clone Repository

```bash
git clone <repository-url>
cd "MERN PROJECT/Uber clone"
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit files with your actual values
nano .env
nano backend/.env
nano frontend/.env
```

Update the following in `.env`:

- `DB_URL`: MongoDB connection string
- `JWT_SECRET`: Strong random secret for JWT tokens
- `MAPBOX_API_TOKEN`: Mapbox API key for maps
- `VITE_API_URL`: Frontend API URL (for production)

### 3. Backend Setup

```bash
cd backend
npm install
cd ..
```

### 4. Frontend Setup

```bash
cd frontend
npm install
cd ..
```

## 💻 Development

### Run Locally (without Docker)

```bash
# Terminal 1: Start Backend
cd backend
npm start
# Backend runs on http://localhost:5000

# Terminal 2: Start Frontend
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Run with Docker Compose

```bash
docker compose up -d
```

The application will be available at:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **MongoDB**: localhost:27017

### Stop Services

```bash
docker compose down
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

## 🐳 Docker Deployment

### Build Images Locally

```bash
docker compose build
```

### Run Services

```bash
docker compose up -d
```

### Verify Services

```bash
docker compose ps
docker compose logs
```

### Health Checks

Services include health checks that automatically monitor availability:

```bash
# Check health status
docker compose ps
# STATUS column shows "healthy", "unhealthy", or "starting"
```

### Cleanup

```bash
# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v

# Remove all Docker images
docker rmi uber_backend uber_frontend mongo:6-alpine
```

## 🔄 Jenkins CI/CD Pipeline

### Prerequisites

1. Jenkins server running with Docker support
2. Repository access (GitHub, GitLab, etc.)
3. Docker daemon accessible from Jenkins

### Pipeline Stages

The Jenkinsfile includes the following stages:

1. **Checkout** - Clone repository
2. **Validate Environment** - Check tools availability
3. **Lint & Test - Backend** - Run backend tests
4. **Lint & Test - Frontend** - Run frontend linting and build
5. **Build Docker Images** - Build all Docker images
6. **Start Services** - Start all containers
7. **Health Check** - Verify services are healthy
8. **Integration Tests** - Test API endpoints
9. **Log Service Status** - Collect service logs

### Setup Jenkins Job

1. Create a new **Pipeline** job in Jenkins
2. Configure repository:
   - Repository URL
   - Credentials (if private)
3. Pipeline script from SCM:
   - SCM: Git
   - Script Path: `Jenkinsfile`
4. Build triggers (optional):
   - Poll SCM: `H/15 * * * *` (every 15 minutes)
   - Webhook: GitHub/GitLab push events

### Run Pipeline

```bash
# Trigger manually in Jenkins UI
# Or via webhook when code is pushed
```

### View Build Logs

```bash
# In Jenkins UI
Build > Console Output
```

### Troubleshooting Jenkins Issues

```bash
# SSH to Jenkins server
ssh jenkins-server

# Check Docker daemon
sudo systemctl status docker

# Verify Jenkins can access Docker
docker ps

# Check Jenkins logs
tail -f /var/log/jenkins/jenkins.log
```

## 🔐 Environment Variables

### Backend (.env)

```env
# Database
DB_URL=mongodb://mongodb:27017

# Server
PORT=5000
NODE_ENV=production

# Security
JWT_SECRET=your_super_secret_key

# External APIs
MAPBOX_API_TOKEN=your_mapbox_token

# CORS
SOCKET_IO_CORS_ORIGIN=http://frontend:3000
CORS_ORIGIN=http://frontend:3000
```

### Frontend (.env)

```env
# API Configuration
VITE_API_URL=http://localhost:5000

# Mapbox
VITE_MAPBOX_API_TOKEN=your_mapbox_token
```

### Production Considerations

- Generate strong `JWT_SECRET` (use: `openssl rand -base64 32`)
- Use environment-specific values
- Never commit `.env` to version control
- Rotate secrets regularly
- Use secrets management tools (HashiCorp Vault, AWS Secrets Manager, etc.)

## 📚 API Documentation

### User Routes

- `POST /users/register` - Register new user
- `POST /users/login` - User login
- `GET /users/profile` - Get user profile
- `POST /users/logout` - User logout

### Captain Routes

- `POST /captains/register` - Register new captain
- `POST /captains/login` - Captain login
- `GET /captains/profile` - Get captain profile
- `POST /captains/logout` - Captain logout

### Ride Routes

- `POST /rides/create` - Create new ride
- `GET /rides/:id` - Get ride details
- `PATCH /rides/:id/accept` - Captain accepts ride
- `PATCH /rides/:id/start` - Start ride
- `PATCH /rides/:id/end` - End ride

### Maps Routes

- `GET /maps/get-coordinates` - Get coordinates from address
- `GET /maps/get-distance-time` - Get distance and time between locations
- `GET /maps/get-suggestions` - Get address suggestions

## 🔍 Troubleshooting

### Backend Connection Issues

```bash
# Check MongoDB connection
docker compose logs mongodb

# Verify database URL
echo $DB_URL

# Test MongoDB connection
docker exec uber_backend npm test
```

### Frontend Build Issues

```bash
# Clear node_modules and rebuild
docker compose down
rm -rf frontend/node_modules
docker compose build --no-cache
docker compose up -d
```

### Docker Port Conflicts

```bash
# Check port usage
netstat -tuln | grep LISTEN

# If ports already in use, stop conflicting services
docker ps
docker stop <container_id>

# Or change ports in docker-compose.yml
```

### Socket.io Connection Issues

```bash
# Verify Socket.io server is running
docker compose logs backend | grep -i socket

# Check CORS settings
# Ensure SOCKET_IO_CORS_ORIGIN matches frontend URL
```

### Slow Build Times

```bash
# Use BuildKit for faster builds
export DOCKER_BUILDKIT=1
docker compose build

# or
docker buildx build --tag <image> .
```

## 📊 Monitoring and Logs

### View Real-time Logs

```bash
docker compose logs -f
```

### Filter Logs

```bash
# Backend logs only
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail 100 backend

# Since specific time
docker compose logs --since 2024-01-01T10:00:00 backend
```

### Health Status

```bash
docker compose ps
```

Health status shows:

- `healthy` - Container is responding to health checks
- `unhealthy` - Container failed health checks
- `starting` - Container is still warming up

## 🚢 Production Deployment

### Pre-deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups enabled
- [ ] SSL/TLS certificates installed
- [ ] Firewall rules configured
- [ ] Health checks passing
- [ ] Load balancer configured (if needed)
- [ ] Logging aggregation setup
- [ ] Monitoring and alerts configured

### Deployment Commands

```bash
# Pull latest code
git pull origin main

# Build and start services
docker compose up -d --build

# Verify deployment
docker compose ps
docker compose logs backend | tail -50

# Run health checks
curl http://localhost:3000
curl http://localhost:5000
```

### Rollback Procedure

```bash
# Stop current deployment
docker compose down

# Checkout previous version
git checkout <previous-commit>

# Restart with previous version
docker compose up -d
```

## 📝 Additional Resources

- [Docker Documentation](https://docs.docker.com)
- [Express.js Guide](https://expressjs.com)
- [React Documentation](https://react.dev)
- [MongoDB Manual](https://docs.mongodb.com/manual)
- [Jenkins Documentation](https://www.jenkins.io/doc)

## 📧 Support

For issues and questions:

1. Check the Troubleshooting section
2. Review logs: `docker compose logs`
3. Check GitHub Issues
4. Contact development team

---

**Last Updated**: May 4, 2026

**Version**: 1.0.0
