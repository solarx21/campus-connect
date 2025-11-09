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

## Deployment Guide 🚀

### Option 1: Vercel + Railway (Recommended)

#### 1. Database Setup (MongoDB Atlas)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGODB_URI` in your environment variables

#### 2. Backend Deployment (Railway)
1. Go to [Railway.app](https://railway.app)
2. Connect your GitHub repo
3. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```
4. Deploy!

#### 3. Frontend Deployment (Vercel)
1. Go to [Vercel.com](https://vercel.com)
2. Import your frontend folder from GitHub
3. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-railway-url.up.railway.app
   ```
4. Deploy!

### Option 2: Render + Vercel

#### Backend on Render
1. Go to [Render.com](https://render.com)
2. Create a new Web Service
3. Connect your backend repo
4. Set build command: `npm run build`
5. Set start command: `npm start`
6. Add environment variables (same as Railway)
7. Deploy!

#### Frontend on Vercel (same as above)

### Environment Variables Summary

#### Backend (Railway/Render)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

#### Frontend (Vercel)
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

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