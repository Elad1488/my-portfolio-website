# How to Open and View Your Website

## Method 1: Double-Click (Easiest)

1. **Navigate to your project folder** (`C:\myWebsite`)
2. **Find the file** `index.html`
3. **Double-click** on `index.html`
4. The website will open in your default web browser (Chrome, Edge, Firefox, etc.)

## Method 2: Right-Click Menu

1. **Right-click** on `index.html`
2. Select **"Open with"** → Choose your preferred browser (Chrome, Edge, Firefox, etc.)

## Method 3: Drag and Drop

1. **Open your web browser** (Chrome, Edge, Firefox, etc.)
2. **Drag** the `index.html` file from the folder
3. **Drop** it into the browser window

## Method 4: From Browser Address Bar

1. **Open your web browser**
2. Press **Ctrl + L** (or click the address bar)
3. Type: `file:///C:/myWebsite/index.html`
4. Press **Enter**

## Method 5: Using File Explorer

1. **Open File Explorer** and navigate to `C:\myWebsite`
2. **Click** on the address bar at the top
3. Type: `index.html` and press **Enter**

## Troubleshooting

- **If the website doesn't look right**: Make sure `style.css` and `script.js` are in the same folder as `index.html`
- **If images don't load**: Check that all image files are in the correct location
- **If styles are missing**: Check the browser console (F12) for any error messages

## Live Server (For Development)

If you want to test with a local server (recommended for development):

1. Install **Live Server** extension in VS Code
2. Right-click on `index.html`
3. Select **"Open with Live Server"**

Or use Python's built-in server:
```bash
# In the project folder, run:
python -m http.server 8000
# Then open: http://localhost:8000
```

---

**That's it! Your website should now be visible in your browser! 🎉**
