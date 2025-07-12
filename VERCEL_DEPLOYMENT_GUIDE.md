# 🚀 Vercel Deployment Guide for Crowe Logic AI

## 🎯 **QUICK DEPLOYMENT**

Run this single command to deploy:
```bash
./deploy-vercel.sh
```

## 📋 **STEP-BY-STEP PROCESS**

### **1. Pre-Deployment (5 minutes)**
```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login
```

### **2. Deploy to Vercel (2 minutes)**
```bash
# From your project root
vercel --prod
```

### **3. Configure Environment Variables (3 minutes)**

After deployment, add these in the Vercel dashboard:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings > Environment Variables**
3. Add these variables:

```env
OPENAI_API_KEY=sk-proj-your-openai-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-vercel-url.vercel.app
```

### **4. Redeploy (1 minute)**
```bash
# Trigger a new deployment to use the environment variables
vercel --prod
```

---

## ⚙️ **VERCEL CONFIGURATION**

Your `vercel.json` is already configured with:
- ✅ **Performance**: Optimized build settings
- ✅ **Security**: Security headers included
- ✅ **Functions**: 30-second timeout for AI API calls
- ✅ **Redirects**: SEO-friendly URL structure

---

## 🔧 **AUTOMATIC DEPLOYMENTS**

### **GitHub Integration (Recommended)**
1. Push your code to GitHub
2. Connect repository in Vercel dashboard
3. Every push to `main` branch auto-deploys

### **Manual Deployments**
```bash
# Deploy current state
vercel --prod

# Deploy specific branch
vercel --prod --git-branch feature-branch
```

---

## 📊 **POST-DEPLOYMENT CHECKLIST**

### **Immediate (First 10 minutes)**
- [ ] Test the live URL
- [ ] Verify API endpoints work
- [ ] Test AI chat functionality
- [ ] Check mobile responsiveness

### **Within 24 Hours**
- [ ] Set up custom domain (optional)
- [ ] Configure analytics
- [ ] Set up error monitoring
- [ ] Test with real users

### **Within Week 1**
- [ ] Monitor performance metrics
- [ ] Review error logs
- [ ] Gather user feedback
- [ ] Plan next features

---

## 🌐 **CUSTOM DOMAIN SETUP**

### **Option 1: Vercel Domain**
```bash
# Your app will be at:
https://crowe-logic-ai.vercel.app
```

### **Option 2: Custom Domain**
1. Purchase domain (e.g., crowelogic-ai.com)
2. In Vercel dashboard: **Settings > Domains**
3. Add your domain
4. Configure DNS records as shown
5. SSL certificate auto-generated

---

## 📈 **MONITORING & ANALYTICS**

### **Built-in Vercel Analytics**
- Real-time performance metrics
- Core Web Vitals tracking
- Geographic user distribution
- Traffic patterns

### **Error Monitoring**
```bash
# Add to your environment variables
SENTRY_DSN=your_sentry_url_here
```

### **Custom Analytics**
```bash
# Google Analytics (optional)
NEXT_PUBLIC_GA_ID=your_ga_id_here
```

---

## 🚀 **DEPLOYMENT ENVIRONMENTS**

### **Production**
```bash
vercel --prod  # Live environment
```

### **Preview**
```bash
vercel  # Preview deployment for testing
```

### **Development**
```bash
npm run dev  # Local development
```

---

## 🛠️ **TROUBLESHOOTING**

### **Common Issues**

**1. Build Failures**
```bash
# Check locally first
npm run build
npm run type-check
npm run lint
```

**2. Environment Variables Not Working**
- Redeploy after adding env vars
- Check variable names match exactly
- Ensure no extra spaces in values

**3. API Timeouts**
- Vercel function timeout is set to 30s
- Check API key validity
- Monitor API rate limits

**4. Domain Issues**
- DNS propagation takes 24-48 hours
- Verify CNAME/A records are correct
- Check SSL certificate status

---

## 💰 **VERCEL PRICING**

### **Hobby Plan (Free)**
- Perfect for getting started
- 100GB bandwidth/month
- Automatic HTTPS
- Global CDN

### **Pro Plan ($20/month)**
- Unlimited bandwidth
- Team collaboration
- Advanced analytics
- Priority support

---

## 🎉 **READY TO DEPLOY?**

Your Crowe Logic AI is configured and ready for Vercel deployment!

**Next action:**
```bash
./deploy-vercel.sh
```

🍄 **Your mycology assistant will be live in minutes!**
