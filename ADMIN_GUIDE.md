# Portfolio Manager - Admin Guide

## 🎯 Overview

Your portfolio website now includes a powerful admin panel that lets you manage all your content without editing code! You can add projects, link YouTube videos, manage skills, update contact info, and more - all through a user-friendly interface.

## 🚀 Getting Started

### Accessing the Admin Panel

1. Open `admin.html` in your browser (double-click the file)
2. Or navigate to: `file:///C:/myWebsite/admin.html`

### First Time Setup

1. **Hero Section**: Update your name, subtitle, and description
2. **About Section**: Add information about yourself
3. **Skills**: Add your technical skills
4. **Contact**: Add your email, phone, and social media links
5. **Projects**: Start adding your projects!

## 📝 Managing Projects

### Adding a New Project

1. Click the **"Projects"** tab
2. Click **"+ Add Project"** button
3. Fill in the form:
   - **Project Name** (required)
   - **Description** (required)
   - **Thumbnail Image URL**: Use local filename (e.g., `project1.jpg`) or full URL
   - **YouTube Video URL**: Paste any YouTube URL - it will be automatically embedded!
   - **Technologies**: Comma-separated (e.g., "React, Node.js, MongoDB")
   - **Project URL**: Link to live project
   - **Source Code URL**: Link to GitHub/repository
4. Click **"Save Project"**

### Editing a Project

1. Find the project in the list
2. Click **"Edit"** button
3. Make your changes
4. Click **"Save Project"**

### Deleting a Project

1. Find the project in the list
2. Click **"Delete"** button
3. Confirm deletion

### Reordering Projects (Drag & Drop)

1. Simply **drag** a project card up or down
2. **Drop** it in the desired position
3. The order is automatically saved!

## 🎥 YouTube Video Integration

### How to Add YouTube Videos

1. When adding/editing a project, paste the YouTube URL in the "YouTube Video URL" field
2. Supported formats:
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `https://www.youtube.com/embed/VIDEO_ID`
3. The video will automatically replace the thumbnail image and be embedded in the project card
4. Visitors can play the video directly on your portfolio!

## 🎨 Managing Other Content

### About Section

- Go to **"About & Skills"** tab
- Edit the two text paragraphs
- Changes save automatically as you type!

### Skills

- Go to **"About & Skills"** tab
- Click **"+ Add Skill"** to add new skills
- Click **"Remove"** to delete skills
- Edit skill names directly in the input fields

### Contact Information

- Go to **"Contact Info"** tab
- Update email, phone, and social media links
- Changes save automatically!

### Hero Section

- Go to **"Hero Section"** tab
- Update your name, subtitle, and description
- Changes save automatically!

## 💾 Saving Your Work

- Most changes save **automatically** as you type
- Click **"Save All Changes"** button in the header to ensure everything is saved
- All data is stored in your browser's localStorage (no server needed!)

## 👀 Viewing Your Site

1. Click **"View Site"** button in the admin panel header
2. Or open `index.html` directly
3. Your changes will appear immediately!

## 🌐 Making Your Website Public

### Currently: Local Files Only

Right now, your website is just files on your computer. To make it public, you need to host it online.

### Option 1: GitHub Pages (Free & Easy)

1. Create a GitHub account at [github.com](https://github.com)
2. Create a new repository
3. Upload all your files (index.html, style.css, script.js, admin.html, admin.css, admin.js, and any images)
4. Go to Settings → Pages
5. Select your main branch
6. Your site will be live at: `https://yourusername.github.io/repository-name`

### Option 2: Netlify (Free & Fast)

1. Go to [netlify.com](https://netlify.com)
2. Sign up for free
3. Drag and drop your entire website folder
4. Your site is instantly live!

### Option 3: Vercel (Free & Modern)

1. Go to [vercel.com](https://vercel.com)
2. Sign up for free
3. Import your project
4. Deploy instantly!

### Option 4: Traditional Web Hosting

- Upload files via FTP to any web hosting service
- Examples: Bluehost, HostGator, SiteGround, etc.

## ⚠️ Important Notes

### Data Storage

- All your content is stored in **localStorage** (browser storage)
- This means:
  - ✅ Works offline, no server needed
  - ⚠️ Data is stored per browser/device
  - ⚠️ If you clear browser data, you'll lose your content
  - 💡 **Backup Tip**: Export your data regularly (see below)

### Browser Compatibility

- Works best in modern browsers (Chrome, Firefox, Safari, Edge)
- Make sure JavaScript is enabled

### Admin Panel Security

- Currently, the admin panel is accessible to anyone who opens `admin.html`
- For production, consider:
  - Adding password protection
  - Using a backend server
  - Restricting access to admin.html

## 🔧 Troubleshooting

### Projects Not Showing?

- Make sure you've saved projects in the admin panel
- Check browser console (F12) for errors
- Try refreshing the page

### YouTube Videos Not Embedding?

- Make sure you're using a valid YouTube URL
- Check that the URL format is correct
- Try copying the URL directly from YouTube

### Changes Not Saving?

- Check if JavaScript is enabled
- Try clicking "Save All Changes" manually
- Check browser console (F12) for errors

### Can't Drag Projects?

- Make sure you're clicking and holding on the project card
- Try a different browser
- Check that JavaScript is enabled

## 📚 Tips & Best Practices

1. **Regular Backups**: Export your localStorage data periodically
2. **Image Optimization**: Compress images before uploading for faster loading
3. **YouTube Thumbnails**: YouTube videos automatically show video thumbnails
4. **Project Order**: Use drag & drop to showcase your best projects first
5. **Descriptions**: Write clear, engaging project descriptions
6. **Technologies**: List relevant technologies for each project

## 🎉 You're All Set!

Your portfolio is now fully manageable through the admin panel. No coding required - just point, click, and drag!

---

**Need Help?** Check the browser console (F12) for any error messages, or review this guide again.
