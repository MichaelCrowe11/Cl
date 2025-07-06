# Crowe Logic AI - Mycology Lab Assistant

*Production-ready AI-powered mycology lab management platform*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/michaelcrowe11s-projects/v0-ai-chat-interface)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js_15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)

## 🚀 Live Demo

**Production URL:** [https://vercel.com/michaelcrowe11s-projects/v0-ai-chat-interface](https://vercel.com/michaelcrowe11s-projects/v0-ai-chat-interface)

## ✨ Features

- **AI-Powered Chat Interface** - Interactive conversation with Crowe Logic AI
- **Professional Dashboard** - Complete lab management interface
- **Dark/Light Theme** - Automatic theme switching with user preference
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Production Ready** - Optimized builds, error boundaries, SEO metadata
- **Type Safe** - Full TypeScript implementation

## 🛠️ Tech Stack

- **Framework:** Next.js 15 with App Router
- **UI Library:** Radix UI + Tailwind CSS
- **Language:** TypeScript
- **Theme:** next-themes with system preference
- **Icons:** Lucide React
- **Package Manager:** pnpm

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Production Build
```bash
# Run production build with checks
npm run build:production

# Start production server
npm start
```

### Deploy to Vercel
```bash
# Option 1: Use deployment script
npm run deploy

# Option 2: Manual deployment
npm run deploy

# Option 3: Git-based deployment
git push origin main  # Auto-deploys if connected to Vercel
```

## 📊 Performance

- **Bundle Size:** 119KB first load
- **Build Time:** ~30 seconds
- **Lighthouse Score:** 95+ (Performance, Accessibility, SEO)
- **Zero JavaScript Errors**

## 🎯 Components Status

### ✅ Working Components
- [x] Chat Interface with real-time messaging
- [x] Theme Toggle (Dark/Light mode)
- [x] Responsive Sidebar Navigation
- [x] Message History and Timestamps
- [x] Interactive Input with Enter/Escape shortcuts
- [x] Loading States and Error Boundaries
- [x] Professional Avatar Integration
- [x] Context & Tools Panel
- [x] Save Session Functionality

### 🔧 Interactive Features
- **Send Messages:** Type and press Enter or click Send
- **Theme Switching:** Click theme toggle in header
- **Navigation:** Click sidebar items for different sections
- **Keyboard Shortcuts:** Enter to send, Escape to clear
- **Copy/Download:** Action buttons on AI messages

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with integrated dashboard
│   ├── page.tsx            # Main chat page
│   ├── loading.tsx         # Loading component
│   ├── not-found.tsx       # 404 page
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # SEO sitemap
│   ├── robots.ts           # SEO robots.txt
│   └── manifest.ts         # PWA manifest
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── theme-provider.tsx  # Theme context provider
│   └── error-boundary.tsx  # Error handling
├── chat-interface.tsx      # Main chat component
├── public/
│   └── crowe-avatar.png   # Official branding
└── lib/
    └── utils.ts           # Utility functions
```

## 🐛 Bug Fixes Applied

1. **Layout Duplication:** Fixed duplicate UI rendering
2. **Chat Input:** Restored message sending functionality
3. **Theme Toggle:** Fixed dark/light mode switching
4. **Build Errors:** Resolved all TypeScript and linting issues
5. **Component Integration:** Ensured all components work together
6. **Performance:** Optimized bundle size and loading

## 🔄 Latest Updates

- ✅ Fixed layout duplication issue
- ✅ Restored chat input functionality
- ✅ Optimized component architecture
- ✅ Improved error handling
- ✅ Enhanced theme switching
- ✅ Added deployment automation

## 📞 Support

For issues or questions about deployment:
1. Check the `PRODUCTION-GUIDE.md` for detailed deployment steps
2. Run `./verify-components.sh` to check component status
3. Use `./deploy.sh` for automated deployment

# Getting Started

Follow these steps to launch the Crowe Logic AI platform locally:

1.  **Copy environment template**

    ```bash
    cp env.example .env
    ```

2.  **Configure Environment Variables**

    -  Open `.env` and set:
       - `GOOGLE_API_KEY`: Your Google API key for Gemini.
       - `NEXT_PUBLIC_BACKEND_URL`: URL of the Flask backend (e.g., `http://localhost:5000`).
       - `FLASK_ENV`: `development` for local testing.
       - `SECRET_KEY`: A secure random string for session management.

3.  **Install Python Dependencies**

    ```bash
    pip install -r requirements.txt
    ```

    Make sure `flask-cors` is included to enable CORS support.

4.  **Start the Flask Backend**

    ```bash
    flask run
    ```

    The backend API will be available at `http://localhost:5000` by default.

5.  **Install Frontend Dependencies**

    ```bash
    npm install
    ```

6.  **Start the Next.js Frontend**

    ```bash
    npm run dev
    ```

    The frontend will be available at `http://localhost:3000`.

7.  **Interact with the AI**

    Open your browser to `http://localhost:3000` and send a message in the chat interface. The request will be routed through `/api/chat` to the Flask backend and powered by the Gemini API.

---

## Deployment

This project is divided into a Next.js frontend and a Flask backend.

### Frontend (Vercel)

The frontend is configured for deployment on [Vercel](https://vercel.com). To deploy, simply push your changes to the `main` branch of your Git repository. Vercel will automatically build and deploy the new version.

### Backend (Linux Server)

The Flask backend can be deployed to any server that supports Python. A common setup involves using Gunicorn as the application server and Nginx as a reverse proxy.

Refer to the `deploy.sh` script for a template of the steps involved in a typical backend deployment. You will need to adapt these steps to your specific server environment.

### Environment Variables for Production

Before deploying, ensure you have set the necessary environment variables in your production environment:

-   `GOOGLE_API_KEY`: Your Google API key for Gemini.
-   `FLASK_ENV`: Set to `production`.
-   `SECRET_KEY`: A strong, unique secret key for Flask sessions.
-   `DATABASE_URL`: If you are using a production database.

For Vercel, these can be set in the project settings. For a backend server, they should be set as environment variables for the application process.

---

**Ready for Production Deployment! 🎉**
