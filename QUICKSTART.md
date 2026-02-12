# ⚡ QuickStart - Get Your CRM Live in 5 Minutes

## 🎯 Three Simple Steps

### **1️⃣ Create GitHub Account**
- Go to https://github.com/signup
- Sign up and verify email

### **2️⃣ Push Code to GitHub**
```bash
cd /home/user/go_expansion

# First, create repo on GitHub at https://github.com/new
# Name: go-expansion-crm
# Then run:

git remote add origin https://github.com/YOUR_USERNAME/go-expansion-crm.git
git branch -M main
git push -u origin main
```

### **3️⃣ Deploy to Vercel**
1. Go to https://vercel.com/signup
2. Click "Continue with GitHub"
3. Click "Create New Project"
4. Select `go-expansion-crm`
5. Click "Deploy"
6. **Add these env variables:**
   - `VITE_SUPABASE_URL` = `https://jwdsavanjrwtzpxbtczi.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (your anon key from above)
7. Wait 2 minutes... Done! 🎉

---

## 🌐 Your Live URL
Once deployed, Vercel shows you a live URL like:
```
https://go-expansion-crm-xxxxx.vercel.app
```

## ✅ Test It
1. Visit your Vercel URL
2. Click "Sign Up"
3. Create test account
4. You're in the CRM! Explore all pages

---

## 📚 Full Guide
See `DEPLOYMENT.md` for detailed instructions

---

## 🆘 Need Help?
All your credentials are set up. Just follow the 3 steps above!
