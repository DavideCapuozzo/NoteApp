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
- **📝 Smart Note Editor** - Clean, distraction-free writing experience with auto-save
- **📁 File Import** - Seamlessly import `.txt` files to continue your work
- **💾 Export Options** - Download your notes anytime with a single click
- **🔐 Secure Authentication** - Local registration/login + Google OAuth integration

### 🤖 **AI-Powered Writing Assistant**
- **💬 Intelligent Chat** - Powered by Google's Gemini AI model
- **📋 Smart Upload** - Transfer AI responses directly to your notes
- **🎯 Context-Aware** - AI understands your note content for better assistance
- **⚡ Real-time Responses** - Fast, responsive AI interactions

### 🎨 **Modern User Experience**
- **📱 Fully Responsive** - Perfect experience on desktop, tablet, and mobile
- **🌟 Smooth Animations** - Powered by Motion/Framer Motion
- **🎯 Intuitive Navigation** - Clean, organized interface
- **⚡ Lightning Fast** - Optimized performance with Vite

### 📊 **Personal Dashboard**
- **📈 Writing Statistics** - Track your notes count and word count
- **📋 Notes Management** - Organize and browse all your notes
- **👤 Profile Management** - Customize your account settings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/YourUsername/NoteApp.git
   cd NoteApp/client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   VITE_API_URL=your_backend_url
   VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🛠️ Tech Stack

### **Frontend Framework**
- **React 19.1.1** - Latest React with concurrent features
- **TypeScript 5.8.3** - Type-safe development
- **Vite 7.1.2** - Ultra-fast build tool and dev server

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
- **Sonner** - Beautiful toast notifications

### **Development Tools**
- **ESLint** - Code linting and formatting
- **TypeScript ESLint** - TypeScript-specific linting rules

## 📱 Screenshots & Demo

### Home Page
Clean, modern landing page with responsive video showcase

### Note Editor
Distraction-free writing environment with AI chat integration

### AI Assistant
Intelligent AI chat that helps with writing and research

### Dashboard
Personal workspace to manage all your notes

## 🎯 Key Features Breakdown

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

```bash
# Development
npm run dev          # Start development server

# Building
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth-component/   # Authentication related
│   ├── dashboard-component/ # Dashboard features
│   ├── home/            # Landing page components
│   ├── note-component/  # Note editor & AI chat
│   └── ui/              # Base UI components
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── services/            # API services
├── store/               # Redux store & slices
└── lib/                 # Utilities & configurations
```

## 🔧 Configuration

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
