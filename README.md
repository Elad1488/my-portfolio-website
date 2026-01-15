# Portfolio Website

A modern, responsive portfolio website with an admin panel for easy content management.

## 🌐 Live Site

- **Main Website**: [https://elad1488.github.io/my-portfolio-website/](https://elad1488.github.io/my-portfolio-website/)
- **Admin Panel**: [https://elad1488.github.io/my-portfolio-website/admin.html](https://elad1488.github.io/my-portfolio-website/admin.html)

## Features

- 🎨 **Modern Design**: Clean, professional dark theme
- 📱 **Fully Responsive**: Works on all devices
- 🎬 **Project Management**: Add projects with YouTube video integration
- 🖼️ **Gallery with Sections**: Organize images into categories with drag-and-drop
- ⚙️ **Admin Panel**: Easy-to-use GUI for managing all content
- 💾 **Data Persistence**: Data stored in localStorage and can be exported to JSON
- 🎯 **No Backend Required**: Pure HTML, CSS, and JavaScript

## Quick Start

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/Elad1488/my-portfolio-website.git
   cd my-portfolio-website
   ```

2. **Open the website**
   - Simply open `index.html` in your web browser
   - Or use a local server (recommended):
     ```bash
     # Using Python 3
     python -m http.server 8000
     
     # Using Python 2
     python -m SimpleHTTPServer 8000
     
     # Using Node.js (if you have http-server installed)
     npx http-server
     ```
   - Then visit `http://localhost:8000` in your browser

3. **Access the Admin Panel**
   - Open `admin.html` in your browser
   - Or click the "Admin Panel" link in the footer of the main site
   - Or visit: [https://elad1488.github.io/my-portfolio-website/admin.html](https://elad1488.github.io/my-portfolio-website/admin.html)

## File Structure

```
.
├── index.html          # Main portfolio website
├── admin.html          # Admin panel for content management
├── style.css           # Main website styles
├── admin.css           # Admin panel styles
├── script.js           # Main website functionality
├── admin.js            # Admin panel functionality
├── data.json           # Default data file (loaded if localStorage is empty)
├── profile.jpg         # Profile picture
└── README.md           # This file
```

## Admin Panel Features

### Projects Management
- Add/edit/delete projects
- Link YouTube videos (thumbnails auto-generated)
- Drag and drop to reorder projects
- Custom thumbnails supported

### Gallery Management
- Create sections/categories
- Upload images or use image URLs
- Support for GIFs (up to 60MB)
- Drag and drop to move images between sections
- Add titles and descriptions

### Data Export/Import
- **Export Data**: Download all your data as JSON file
- **Import Data**: Load data from a JSON file
- Use this to backup your data or share it between devices

### Other Sections
- **About**: Edit about section text
- **Skills**: Add/remove skills
- **Contact**: Update contact information and social links
- **Hero**: Customize hero section content

## Data Storage

The website uses two methods for data storage:

1. **localStorage** (Browser storage)
   - Data is stored in each user's browser
   - Works offline
   - Data persists between sessions

2. **data.json** (Default data file)
   - Loaded automatically if localStorage is empty
   - Can be updated in the repository
   - Allows sharing default content with all visitors

### Exporting Data

To make your data available to all visitors:

1. Open the Admin Panel
2. Click "Export Data" button
3. This downloads a `data.json` file
4. Replace the `data.json` file in your repository with the exported one
5. Commit and push to GitHub
6. All visitors will see your content!

## Making Your Site Public

This site is already deployed on GitHub Pages:
- **Live URL**: [https://elad1488.github.io/my-portfolio-website/](https://elad1488.github.io/my-portfolio-website/)

### Alternative Hosting Options

#### Option 1: Netlify (Free)
1. Go to [netlify.com](https://www.netlify.com)
2. Sign up/login
3. Click "Add new site" → "Deploy manually"
4. Drag and drop your project folder
5. Your site will be live instantly!

#### Option 2: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Click "New Project"
4. Import your GitHub repository
5. Deploy!

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Customization

### Colors
Edit CSS variables in `style.css`:
```css
:root {
    --primary-color: #000000;
    --accent-color: #3b82f6;
    /* ... */
}
```

### Fonts
The site uses Google Fonts (Inter). You can change this in `index.html` and `admin.html`.

## Support

For issues or questions:
- Check the admin panel for help text
- Review the code comments
- Open an issue on GitHub

## License

This project is open source and available for personal and commercial use.

---

**Made with ❤️ for showcasing your work**