# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites Check

```bash
# Verify you have required tools
node --version        # Should be v18+
npm --version         # Should be v8+
docker --version      # Should be v20.10+
docker compose version # Should be v1.29+
```

### Step 1: Clone & Setup (1 minute)

```bash
cd "MERN PROJECT/Uber clone"

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Edit .env with your values (at minimum, add your Mapbox token)
# nano .env
```

### Step 2: Configure Environment (1 minute)

Edit the files you just created:

```bash
# For local development, you mainly need:
# In .env and backend/.env:
#   - DB_URL=mongodb://mongodb:27017
#   - MAPBOX_API_TOKEN=your_token_here
#   - JWT_SECRET=your_secret_here (or any random string)

# In frontend/.env:
#   - VITE_API_URL=http://localhost:5000
#   - VITE_MAPBOX_API_TOKEN=your_token_here
```

### Step 3: Start Application (1 minute)

```bash
# One command to rule them all
docker compose up -d

# Wait 10-15 seconds for services to start
sleep 15

# Check status
docker compose ps
```

### Step 4: Access Application (1 minute)

Open in your browser:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (internal)

### Step 5: Verify Everything Works (1 minute)

```bash
# Test backend
curl http://localhost:5000

# Check logs
docker compose logs backend | tail -20
docker compose logs frontend | tail -20
docker compose logs mongodb | tail -10
```

---

## 📝 Common First-Time Tasks

### Access MongoDB

```bash
docker compose exec mongodb mongosh
# Then in MongoDB shell:
> use uber-db
> db.users.find()
```

### View Live Logs

```bash
# Watch all logs in real-time
docker compose logs -f

# Watch just backend
docker compose logs -f backend

# Or just frontend
docker compose logs -f frontend
```

### Stop Everything

```bash
docker compose down
```

### Start Again

```bash
docker compose up -d
```

### Complete Reset (⚠️ Loses data)

```bash
docker compose down -v
docker compose up -d
```

---

## 🔧 Development Workflow

### Option 1: Docker Development (Recommended)

```bash
# Start services
docker compose up -d

# View logs
docker compose logs -f

# Make changes to code - they auto-reload!

# To rebuild after dependency changes
docker compose build
docker compose up -d
```

### Option 2: Local Development

```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend (new terminal)
cd frontend
npm install
npm run dev

# Open http://localhost:5173 for frontend (Vite dev server)
```

---

## 🐛 Something Not Working?

### Backend Not Responding

```bash
# Check logs
docker compose logs backend

# Restart it
docker compose restart backend

# Wait a few seconds
sleep 5

# Try again
curl http://localhost:5000
```

### Frontend Shows Blank Page

```bash
# Check logs
docker compose logs frontend

# Clear browser cache (Ctrl+Shift+Delete)

# Restart frontend
docker compose restart frontend
```

### Can't Connect to Database

```bash
# Check MongoDB
docker compose logs mongodb

# Test connection from backend
docker compose exec backend npm test

# Restart MongoDB
docker compose restart mongodb
```

### Port Already in Use

```bash
# Find what's using port 5000 (Windows)
netstat -ano | findstr :5000

# Or Linux/Mac
lsof -i :5000

# Kill the process
# Then restart docker compose
docker compose up -d
```

### Still Stuck?

1. Read [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
2. Check [DEPLOYMENT.md](./DEPLOYMENT.md)
3. View all logs: `docker compose logs`
4. Ask the team!

---

## 📚 Useful Commands Reference

```bash
# View all containers
docker compose ps

# View detailed logs
docker compose logs -f --tail=50

# Restart a service
docker compose restart backend

# Stop everything
docker compose down

# Start everything
docker compose up -d

# Build fresh images
docker compose build --no-cache

# Remove everything (⚠️ Loses data)
docker compose down -v

# Execute command in container
docker compose exec backend npm test

# Monitor resource usage
docker stats

# Check network
docker network ls
```

---

## 🎯 Next Steps

1. **Explore the code**: Check out `backend/` and `frontend/` folders
2. **Run tests**: `npm test` (once tests are added)
3. **Check the API**: Visit http://localhost:5000
4. **Try the UI**: Visit http://localhost:3000
5. **Read the docs**: See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed guide
6. **Deploy**: Follow [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

## 💡 Tips

- 🔄 Changes to code auto-reload in Docker (no restart needed for JS)
- 📝 Check logs first when something breaks: `docker compose logs`
- 💾 Database persists even after `docker compose down`
- 🧹 Use `docker compose down -v` only when you want to reset everything
- 🚀 Ready to deploy? Check [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

---

Happy coding! 🎉
