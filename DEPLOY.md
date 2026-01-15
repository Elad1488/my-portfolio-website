# Deployment Guide

This guide will help you deploy your portfolio website to make it publicly accessible.

## GitHub Pages (Recommended - Free)

GitHub Pages is the easiest way to host your static website for free.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click on "Settings" tab
   - Scroll down to "Pages" in the left sidebar
   - Under "Source", select your branch (usually `main`)
   - Select `/ (root)` folder
   - Click "Save"

3. **Wait a few minutes**
   - GitHub will build and deploy your site
   - Your site will be available at:
     `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

4. **Update links (if needed)**
   - If you have any absolute paths, update them to relative paths
   - The admin panel link in the footer should work automatically

### Custom Domain (Optional)

1. In GitHub Pages settings, enter your custom domain
2. Update your DNS records as instructed by GitHub
3. Enable HTTPS (automatic with GitHub Pages)

---

## Netlify (Alternative - Free)

Netlify offers easy deployment with continuous deployment from GitHub.

### Steps:

1. **Sign up at [netlify.com](https://www.netlify.com)**

2. **Deploy from GitHub**
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub account
   - Select your repository
   - Click "Deploy site"

3. **Automatic deployment**
   - Every time you push to GitHub, Netlify will automatically redeploy
   - You'll get a URL like: `https://your-site-name.netlify.app`

4. **Custom domain**
   - Go to Site settings → Domain management
   - Add your custom domain
   - Update DNS records as instructed

---

## Vercel (Alternative - Free)

Vercel is great for static sites with automatic deployments.

### Steps:

1. **Sign up at [vercel.com](https://vercel.com)**

2. **Import project**
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

3. **Your site is live!**
   - You'll get a URL like: `https://your-site-name.vercel.app`

---

## Important Notes

### localStorage Limitation

⚠️ **Important**: Your website uses localStorage to store data. This means:
- Data is stored in each visitor's browser
- Data is NOT shared between devices
- Clearing browser data will delete the content

### Solutions:

1. **For personal portfolio**: This is fine - you manage it via admin panel
2. **For client editing**: Consider adding a backend or using a headless CMS
3. **For production**: Export/import functionality can be added

### Making Admin Panel Accessible

The admin panel (`admin.html`) will be accessible at:
- `https://YOUR_SITE/admin.html`

**Security Note**: The admin panel has no authentication. Anyone who knows the URL can edit your content. For production use, consider:
- Adding password protection
- Using server-side authentication
- Restricting access via server configuration

---

## Testing Before Deployment

1. **Test locally**
   ```bash
   python -m http.server 8000
   ```
   Visit `http://localhost:8000`

2. **Check all links**
   - Test navigation
   - Test admin panel
   - Test all features

3. **Test on mobile**
   - Use browser dev tools
   - Or test on actual device

---

## Post-Deployment Checklist

- [ ] Test the live site
- [ ] Check admin panel access
- [ ] Test on mobile devices
- [ ] Verify all images load
- [ ] Check YouTube embeds work
- [ ] Test contact form
- [ ] Verify social links

---

## Need Help?

- Check GitHub Pages documentation: https://docs.github.com/en/pages
- Netlify docs: https://docs.netlify.com
- Vercel docs: https://vercel.com/docs
