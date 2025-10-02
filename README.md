# 📝 NoteApp

> **Notebooks, but smarter.** Write, import .txt files, chat with AI, and always download your notes with a single click.

<div align="center">

![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.2-purple?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.12-cyan?style=for-the-badge&logo=tailwindcss)

</div>

## ✨ Features

### 🎯 **Core Functionality**
- **📝 Smart Note Editor** - Clean, distraction-free writing experience
- **📁 File Import** - Seamlessly import `.txt` files to continue your work
- **💾 Export Options** - Download your notes anytime with a single click
- **🔐 Secure Authentication** - Local registration/login + Google OAuth integration

### 🤖 **AI-Powered Writing Assistant**
- **💬 Intelligent Chat** - Powered by Google's Gemini AI model
- **📋 Smart Upload** - Transfer AI responses directly to your notes
- **🎯 Context-Aware** - AI understands your note content for better assistance

### 🎨 **Modern User Experience**
- **📱 Fully Responsive** - Perfect experience on desktop, tablet, and mobile
- **🌟 Smooth Animations** - Powered by Motion/Framer Motion
- **🎯 Intuitive Navigation** - Clean, organized interface

### 📊 **Personal Dashboard**
- **📈 Writing Statistics** - Track your notes count and word count
- **📋 Notes Management** - Organize and browse all your notes
- **👤 Profile Management** - Customize your account settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MongoDB Atlas account or local MongoDB installation

### Full Stack Installation

#### 1. **Clone the repository**
```bash
git clone https://github.com/DavideCapuozzo/NoteApp.git
cd NoteApp
```

#### 2. **Backend Setup**
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Create .env file in server directory
```

**Server Environment Variables (.env)**
```bash
# Database
MONGODB_URI=your_mongodb_connection_string

# JWT Secrets
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Client URL
CLIENT_URL=http://localhost:5173

# Server Port
PORT=5000
```

```bash
# Start server in development mode
npm run dev

# Or start in production mode
npm start
```

#### 3. **Frontend Setup**
```bash
# Navigate to client directory (from project root)
cd ../client

# Install client dependencies
npm install

# Create .env file in client directory
```

**Client Environment Variables (.env)**
```bash
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

```bash
# Start development server
npm run dev
```

#### 4. **Open your browser**
Navigate to `http://localhost:5173`

### 🚀 Development Workflow

1. **Start Backend Server:**
   ```bash
   cd server && npm run dev
   ```

2. **Start Frontend in another terminal:**
   ```bash
   cd client && npm run dev
   ```

3. **Access the application:**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:5000`

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Ultra-fast build tool and dev server

### **Backend Framework**
- **Node.js** - JavaScript runtime environment
- **Express.js 4.21.2** - Fast, unopinionated web framework
- **TypeScript 5.8.2** - Type-safe server development
- **ts-node** - TypeScript execution environment

### **Database & ODM**
- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose 8.17.2** - Elegant MongoDB object modeling

### **Authentication & Security**
- **JWT (jsonwebtoken 9.0.2)** - Secure token-based authentication
- **Passport.js 0.7.0** - Authentication middleware
- **Passport Google OAuth20** - Google OAuth integration
- **bcryptjs 3.0.2** - Password hashing
- **express-session 1.18.2** - Session management

### **Styling & UI**
- **Tailwind CSS 4.1.12** - Utility-first CSS framework
- **Radix UI** - High-quality, accessible component primitives
- **Motion** - Smooth animations and interactions
- **Lucide React** - Beautiful, customizable icons

### **State Management**
- **Redux Toolkit 2.8.2** - Efficient state management
- **React Redux 9.2.0** - React bindings for Redux

### **Routing & Navigation**
- **React Router DOM 7.8.1** - Declarative routing

### **API & External Services**
- **Axios 1.11.0** - HTTP client for API requests
- **Google Generative AI** - Gemini AI integration
- **CORS 2.8.5** - Cross-Origin Resource Sharing
- **cookie-parser 1.4.7** - Cookie parsing middleware
- **Sonner** - Beautiful toast notifications

### **Development Tools**
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules
- **nodemon** - Development server auto-restart
- **dotenv 16.4.7** - Environment variables management

## 📱 Screenshots & Demo

### Home Page
Clean, modern landing page with responsive video showcase

### Note Editor
Distraction-free writing environment with AI chat integration

### AI Assistant
Intelligent AI chat that helps with writing and research

### Dashboard
Personal workspace to manage all your notes

## 🔐 Security Features

### **Authentication System**
- **JWT-based Authentication** - Secure token-based access control
- **Refresh Token System** - Automatic token renewal for enhanced security
- **Session Management** - Secure session handling with express-session
- **Password Hashing** - bcryptjs for secure password storage
- **Google OAuth 2.0** - Social login integration

### **Authorization & Middleware**
- **Protected Routes** - Authentication middleware for secure endpoints
- **CORS Configuration** - Cross-origin resource sharing setup
- **Cookie Security** - HTTP-only cookies for token storage
- **Input Validation** - Request data validation and sanitization

### **Database Security**
- **Mongoose ODM** - Object modeling with built-in validation
- **Unique Constraints** - Email and username uniqueness enforcement
- **Reference Integrity** - Proper user-note relationships
- **Secure Queries** - Protection against injection attacks

## 🎯 Key Features Breakdown

### **Backend Architecture**
```typescript
// JWT Authentication Middleware
export const authMiddleware = async(req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success: false,
        message: 'Unauthorised user!'
    });
    
    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch(error) {
        res.status(401).json({
            success: false,
            message: 'Invalid token!'
        });
    }
};
```

### **Database Models**
```typescript
// User Schema with Authentication Support
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: false }, // Optional for Google OAuth
    googleId: { type: String, sparse: true, unique: true },
    authProvider: { 
        type: String, 
        enum: ['local', 'google'], 
        default: 'local' 
    },
    refreshToken: { type: String, default: null }
}, { timestamps: true });
```

### **Smart Note Editor**
```typescript
// Auto-save functionality
const handleTypingChange = (typing: boolean) => {
  setIsTyping(typing);
  // Auto-save logic when user stops typing
};
```

### **AI Integration**
```typescript
// Gemini AI integration
const { messages, isLoading, error, sendMessage } = useGeminiChat();
```

### **Responsive Design**
```css
/* Mobile-first responsive design */
.hero-section {
  @apply h-[900px] md:h-auto;
  @apply flex flex-col justify-center items-center;
}
```

## 🚀 Available Scripts

### **Frontend (client directory)**
```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
```

### **Backend (server directory)**
```bash
# Development
npm run dev          # Start server with nodemon (auto-restart)
npm start           # Start server in production mode

# Testing
npm test            # Run tests (placeholder)
```

## 📁 Project Structure

```
NoteApp/
├── client/                    # Frontend React Application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── auth-component/    # Authentication UI
│   │   │   ├── dashboard-component/ # Dashboard features
│   │   │   ├── home/             # Landing page components
│   │   │   ├── note-component/   # Note editor & AI chat
│   │   │   └── ui/               # Base UI components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── store/             # Redux store & slices
│   │   └── lib/               # Utilities & configurations
│   ├── public/                # Static assets
│   └── package.json           # Frontend dependencies
│
└── server/                    # Backend Node.js Application
    ├── controllers/           # Business logic
    │   ├── auth/              # Authentication controllers
    │   └── note/              # Note management controllers
    ├── models/                # Database models
    │   ├── User.ts            # User schema
    │   └── Note.ts            # Note schema
    ├── routes/                # API routes
    │   ├── auth/              # Authentication routes
    │   └── note/              # Note routes
    ├── config/                # Configuration files
    │   └── passport.ts        # Passport.js configuration
    ├── server.ts              # Main server file
    └── package.json           # Backend dependencies
```

## � API Documentation

### **Authentication Endpoints**
```bash
# User Registration
POST /api/auth/registration
Body: { username, email, password }

# User Login
POST /api/auth/login
Body: { email, password }

# Google OAuth
GET /api/auth/google
GET /api/auth/google/callback

# Check Authentication
GET /api/auth/check-auth
Headers: Authorization: Bearer <token>

# Logout
POST /api/auth/logout

# Refresh Token
POST /api/auth/refresh

# Update Profile
PUT /api/auth/update-username
PUT /api/auth/update-password
```

### **Notes Endpoints**
```bash
# Create Note
POST /api/notes
Body: { title, content }
Headers: Authorization: Bearer <token>

# Get All User Notes
GET /api/notes?page=1&limit=10
Headers: Authorization: Bearer <token>

# Get Single Note
GET /api/notes/:id
Headers: Authorization: Bearer <token>

# Update Note
PUT /api/notes/:id
Body: { title, content }
Headers: Authorization: Bearer <token>

# Delete Note
DELETE /api/notes/:id
Headers: Authorization: Bearer <token>
```

### **Database Models**

#### **User Model**
```typescript
{
  _id: ObjectId,
  email: String (unique),
  userName: String (unique),
  password: String (hashed),
  googleId: String (optional),
  avatar: String (optional),
  authProvider: 'local' | 'google',
  role: String (default: 'user'),
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### **Note Model**
```typescript
{
  _id: ObjectId,
  title: String (required),
  content: String (required),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## �🔧 Configuration

### **Vite Configuration**
The app uses Vite for fast development and optimized builds:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Optimized for modern browsers
})
```

### **TypeScript Configuration**
Strict TypeScript setup for better code quality:

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "strict": true
  }
}
```

### **Server Configuration**
Express.js server with comprehensive middleware setup:

```typescript
// server.ts
const app = express();

// Security & Session Management
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Authentication
app.use(passport.initialize());
app.use(passport.session());
```

## 🚀 Deployment

### **Frontend Deployment (Vercel/Netlify)**
```bash
# Build for production
cd client
npm run build

# Deploy to Vercel
vercel deploy

# Or deploy to Netlify
netlify deploy --prod --dir=dist
```

### **Backend Deployment (Railway/Heroku)**
```bash
# Prepare for deployment
cd server

# Build TypeScript files
npm run build

# Deploy to Railway
railway deploy

# Or deploy to Heroku
git push heroku main
```

### **Environment Variables for Production**
```bash
# Production Backend (.env)
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
SESSION_SECRET=your_strong_session_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=https://your-domain.com
PORT=5000
NODE_ENV=production

# Production Frontend (.env)
VITE_API_URL=https://your-api-domain.com
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini AI** for intelligent writing assistance
- **Radix UI** for accessible component primitives
- **Tailwind CSS** for rapid UI development
- **React Team** for the amazing framework

---

<div align="center">

**[🌟 Star this repo](https://github.com/YourUsername/NoteApp)** if you found it helpful!

Made with ❤️ by [Your Name]

</div>
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
