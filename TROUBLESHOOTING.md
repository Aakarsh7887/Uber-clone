# Troubleshooting Guide

## Common Issues and Solutions

### 1. Docker Build Failures

#### Issue: `docker compose build` fails with module errors

**Solution:**

```bash
# Clear cache and rebuild
docker compose build --no-cache

# Remove old images
docker rmi $(docker images -f "dangling=true" -q)

# Try again
docker compose up -d --build
```

#### Issue: `Cannot connect to Docker daemon`

**Solution:**

```bash
# Start Docker daemon
sudo systemctl start docker

# Or on macOS
open -a Docker

# Verify Docker is running
docker ps
```

---

### 2. Database Connection Issues

#### Issue: `MongoError: connect ECONNREFUSED`

**Solution:**

```bash
# Check MongoDB is running
docker compose logs mongodb

# Ensure DB_URL is correct in .env
cat backend/.env | grep DB_URL

# Verify MongoDB service in docker-compose.yml
docker compose ps | grep mongodb

# Restart MongoDB
docker compose restart mongodb
docker compose logs -f mongodb
```

#### Issue: `Authentication failed` - MongoDB

**Solution:**

```bash
# Check MongoDB logs
docker compose logs mongodb

# Verify credentials in DB_URL
# Format: mongodb://username:password@host:port

# Reset MongoDB (CAUTION - deletes data)
docker compose down -v
docker compose up -d
```

---

### 3. Port Conflicts

#### Issue: `Address already in use`

**Solution:**

```bash
# Find what's using the port
# Windows
netstat -ano | findstr :5000
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :5000
lsof -i :3000

# Stop the service using the port
# Windows
taskkill /PID <PID> /F

# Linux/Mac
kill -9 <PID>

# Or change ports in docker-compose.yml
# Then run:
docker compose up -d
```

---

### 4. Frontend Build Issues

#### Issue: `npm ERR! code ERESOLVE`

**Solution:**

```bash
cd frontend
npm install --legacy-peer-deps
cd ..
docker compose build --no-cache frontend
```

#### Issue: Frontend shows blank page

**Solution:**

```bash
# Check frontend logs
docker compose logs frontend -f

# Verify VITE_API_URL is correct
docker compose exec frontend env | grep VITE_API_URL

# Clear browser cache
# Ctrl+Shift+Delete in Chrome

# Restart frontend
docker compose restart frontend
```

---

### 5. Backend Connection Issues

#### Issue: `Backend not responding on http://localhost:5000`

**Solution:**

```bash
# Check if backend is running
docker compose ps backend

# View backend logs
docker compose logs backend -f

# Check if port is exposed correctly
docker compose port backend

# Restart backend
docker compose restart backend

# Verify NODE_ENV
docker compose exec backend env | grep NODE_ENV
```

#### Issue: `CORS error in browser console`

**Solution:**

```bash
# Check CORS configuration in backend/.env
cat backend/.env | grep CORS

# Ensure it matches frontend URL
# For local: http://localhost:3000
# Update docker-compose.yml if needed

# Restart backend
docker compose restart backend
```

---

### 6. Socket.io Issues

#### Issue: `WebSocket connection failed`

**Solution:**

```bash
# Check Socket.io logs
docker compose logs backend -f | grep -i socket

# Verify SOCKET_IO_CORS_ORIGIN in backend/.env
cat backend/.env | grep SOCKET_IO_CORS_ORIGIN

# Ensure ports are not blocked by firewall
# Frontend should be able to connect to backend:5000

# Restart services
docker compose restart backend frontend
```

---

### 7. Jenkins Pipeline Failures

#### Issue: `Docker command not found in Jenkins`

**Solution:**

```bash
# SSH to Jenkins server
ssh jenkins-user@jenkins-server

# Check Docker installation
docker --version

# Add Jenkins user to docker group
sudo usermod -aG docker jenkins

# Restart Jenkins
sudo systemctl restart jenkins
```

#### Issue: `pipeline failed at 'docker compose up' stage`

**Solution:**

```bash
# Check Jenkins build logs
Jenkins UI > Build > Console Output

# Verify docker-compose.yml syntax
docker compose config

# Check if Docker daemon is running
sudo systemctl status docker

# Increase Jenkins timeout in Jenkinsfile (default 30 min)
```

#### Issue: `Health check timeout during pipeline`

**Solution:**

```bash
# Increase wait time in Jenkinsfile
# Change "sleep 15" to "sleep 30" or increase retry loops

# Or pre-pull images to save time
docker pull node:18-alpine
docker pull mongo:6-alpine
```

---

### 8. Memory and Disk Issues

#### Issue: `No space left on device`

**Solution:**

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a
docker volume prune

# Remove old logs
find /var/lib/docker -type f -name "*.log" -delete
```

#### Issue: `Out of Memory` errors

**Solution:**

```bash
# Check memory usage
docker stats

# Increase swap (Linux)
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Or increase Docker memory limit (Docker Desktop)
# Preferences > Resources > Memory: increase to 4GB+
```

---

### 9. Network Issues

#### Issue: Containers can't communicate with each other

**Solution:**

```bash
# Check network is created
docker network ls

# Verify network in docker-compose.yml
docker network inspect uber-network

# Restart networking
docker compose down
docker network prune
docker compose up -d
```

---

### 10. Environment Variable Issues

#### Issue: Environment variables not being picked up

**Solution:**

```bash
# Verify .env file exists
ls -la .env

# Check .env syntax (no extra spaces)
cat .env

# Verify variables are loaded in containers
docker compose exec backend env | grep DB_URL

# Recreate containers with fresh env
docker compose down
docker compose up -d
```

---

### 11. Logging Issues

#### Issue: Can't see logs from containers

**Solution:**

```bash
# View all logs
docker compose logs

# Follow logs in real-time
docker compose logs -f

# Get last N lines
docker compose logs --tail 100

# View logs since specific time
docker compose logs --since 2024-01-01T10:00:00

# Export logs to file
docker compose logs > application-logs.txt
```

---

### 12. Performance Issues

#### Issue: Application is slow

**Solution:**

```bash
# Check resource usage
docker stats

# Check for bottlenecks
docker compose logs | grep -i "error\|warning"

# Monitor database queries
docker compose exec mongodb mongosh
> db.currentOp()

# Check network latency between containers
docker compose exec backend ping mongodb
```

---

## Getting Help

### Check Logs First

```bash
# Always start by checking logs
docker compose logs -f

# Filter for errors
docker compose logs | grep -i error
```

### Jenkins Specific

```bash
# SSH to Jenkins server
ssh jenkins-server

# Check Jenkins logs
tail -f /var/log/jenkins/jenkins.log

# Check Docker daemon logs
sudo journalctl -u docker -f
```

### Manual Testing

```bash
# Test backend
curl http://localhost:5000

# Test frontend
curl http://localhost:3000

# Test database connection
docker compose exec backend \
  node -e "require('mongodb').connect(process.env.DB_URL, () => console.log('OK'))"
```

---

## Emergency Commands

### Stop Everything

```bash
docker compose down
docker system prune -f
```

### Reset Everything (⚠️ CAUTION - Data Loss)

```bash
docker compose down -v
docker system prune -a --volumes
docker compose up -d
```

### View Health Status

```bash
docker compose ps
# Check STATUS column for health information
```

### Get Into a Container (Debugging)

```bash
# Backend
docker compose exec backend /bin/sh

# Frontend
docker compose exec frontend /bin/sh

# MongoDB
docker compose exec mongodb mongosh
```

---

## Prevention Tips

1. **Always check logs first**: `docker compose logs -f`
2. **Monitor disk space**: Regularly clean up old volumes and images
3. **Keep dependencies updated**: `npm audit fix`
4. **Test locally before deployment**: Use `docker-compose up` to test
5. **Keep backups**: Backup database regularly
6. **Use health checks**: They help identify issues early
7. **Document changes**: Keep track of configuration changes
8. **Use version control**: Always push working code to Git

---

**Need more help?**

- Check application logs: `docker compose logs`
- Read full documentation: See `DEPLOYMENT.md`
- Review Jenkinsfile: Look for recent changes
- Ask your DevOps team
