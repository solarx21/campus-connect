# Campus Connect 🚀

A fun, lightweight social platform for college students to interact, form groups, collaborate on projects, and socially appreciate each other in a positive way.

## Features ✨

- **User Profiles**: Complete profiles with interests, social links, and bio
- **Cool Rating System**: Vote for cool people (one vote per person)
- **Admire System**: Secret mutual matching with email notifications
- **Rooms & Groups**: Create/join rooms for gaming, study groups, events
- **Real-time Chat**: Instant messaging in rooms using Socket.io
- **Trending Dashboard**: See popular people and rooms
- **Safety Features**: Community guidelines and reporting system
- **Email Verification**: College email validation

## Tech Stack 🛠️

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Real-time**: Socket.io
- **Auth**: JWT with email verification
- **Email**: Nodemailer

## Local Development Setup 🏃‍♂️

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### 1. Clone and Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Setup

#### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campusconnect
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

#### Frontend
The frontend connects to `http://localhost:5000` by default.

### 3. Start MongoDB

For local MongoDB:
```bash
mongod
```

Or use MongoDB Atlas (cloud) and update the connection string.

### 4. Run the Application

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` to use the app!

## Deployment Guide 🚀 (FREE Forever Options)

### Option 1: Vercel + Oracle Cloud (FREE Forever - No Limits)

#### 1. Database Setup (MongoDB Atlas - FREE)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create FREE cluster (512MB storage, no time limits)
3. Get your connection string: `mongodb+srv://...`

#### 2. Backend Deployment (Oracle Cloud Always Free)
1. Go to [Oracle Cloud Free Tier](https://www.oracle.com/cloud/free/)
2. Create account → Get FREE AMD-based VM (1GB RAM, no time limits!)
3. SSH into your VM: `ssh ubuntu@your-vm-public-ip`
4. Install dependencies:
   ```bash
   sudo apt update
   sudo apt install nodejs npm mongodb
   ```
5. Clone and deploy:
   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect/backend
   npm install
   npm run build
   ```
6. Configure environment in `backend/.env`:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://your-atlas-connection-string
   JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=https://your-frontend.vercel.app
   ```
7. Start server:
   ```bash
   npm start
   ```
8. Your backend URL: `http://your-oracle-vm-ip:5000`

#### 3. Frontend Deployment (Vercel - FREE)
1. Go to [Vercel.com](https://vercel.com)
2. Import frontend folder from GitHub
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=http://your-oracle-vm-ip:5000
   ```
4. Deploy! (FREE forever, no bandwidth limits)

### Option 2: Self-Host Everything (FREE VPS)

#### Alternative FREE VPS Options:
- **Oracle Cloud**: 2 AMD VMs, 200GB storage, no time limits
- **AWS Lightsail**: $3.50/month (not free but cheap)
- **DigitalOcean Droplet**: $6/month (not free but cheap)

#### Quick Self-Host Setup:
```bash
# On your VPS (Ubuntu/Debian)
sudo apt update
sudo apt install nodejs npm mongodb

# Clone and setup
git clone https://github.com/yourusername/campus-connect.git
cd campus-connect

# Backend setup
cd backend
npm install
npm run build
# Edit .env file with your settings
npm start

# Frontend setup (optional, can use Vercel)
cd ../frontend
npm install
npm run build
npm start
```

### Environment Variables Summary

#### Backend (Oracle Cloud/Free VPS)
```env
PORT=5000
MONGODB_URI=mongodb+srv://your-atlas-connection-string
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-frontend.vercel.app
```

#### Frontend (Vercel - FREE)
```env
NEXT_PUBLIC_API_URL=http://your-oracle-vm-public-ip:5000
```

## FREE Hosting Comparison

| Service | Cost | Limits | Best For |
|---------|------|--------|----------|
| **Oracle Cloud** | FREE forever | 2 VMs, 200GB storage | Backend hosting |
| **MongoDB Atlas** | FREE tier | 512MB storage | Database |
| **Vercel** | FREE forever | Unlimited bandwidth | Frontend hosting |
| **Railway** | Limited free | Sleeps after 1hr | Quick testing |
| **Render** | Limited free | Sleeps after inactivity | Quick testing |

## API Endpoints 📡

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/login` - Login

### Users
- `GET /api/users/profile/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/search` - Search users
- `POST /api/users/:userId/cool` - Vote cool
- `POST /api/users/:userId/admire` - Send admiration
- `GET /api/users/trending` - Get trending users

### Rooms
- `POST /api/rooms` - Create room
- `GET /api/rooms` - Get rooms
- `POST /api/rooms/:roomId/join` - Join room
- `POST /api/rooms/:roomId/leave` - Leave room
- `GET /api/rooms/:roomId/messages` - Get messages
- `POST /api/rooms/:roomId/messages` - Send message
- `GET /api/rooms/trending` - Get trending rooms

### Reports
- `POST /api/reports` - Submit report
- `GET /api/reports` - Get reports (admin)

## Project Structure 📁

```
campus-connect/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/# React components
│   │   └── ...
│   └── package.json
├── backend/           # Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## Contributing 🤝

1. Fork the repo
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a PR

## License 📄

MIT License - feel free to use this project for your own campus!

---

Made with ❤️ for college students everywhere 🎓