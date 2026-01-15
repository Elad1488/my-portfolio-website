# מדריך העלאה ל-GitHub

## שלב 1: יצירת Repository ב-GitHub

1. היכנס ל-[GitHub.com](https://github.com) והתחבר
2. לחץ על הכפתור הירוק **"New"** או על **"+"** בפינה הימנית העליונה
3. בחר **"New repository"**
4. מלא את הפרטים:
   - **Repository name**: `my-portfolio` (או כל שם שתרצה)
   - **Description**: "My Portfolio Website"
   - בחר **Public** (או Private אם אתה רוצה)
   - **אל תסמן** "Add a README file" (כבר יש לנו)
   - לחץ **"Create repository"**

## שלב 2: העלאת הקבצים

### אפשרות א': דרך GitHub Desktop (הכי קל)

1. הורד והתקן [GitHub Desktop](https://desktop.github.com/)
2. התחבר עם חשבון GitHub שלך
3. לחץ **File → Add Local Repository**
4. בחר את התיקייה `C:\myWebsite`
5. לחץ **Publish repository**
6. בחר את ה-repository שיצרת
7. לחץ **Publish**

### אפשרות ב': דרך Command Line (Terminal)

פתח **PowerShell** או **Command Prompt** בתיקייה `C:\myWebsite`:

```bash
# אתחול Git
git init

# הוסף את כל הקבצים
git add .

# צור commit ראשוני
git commit -m "Initial commit - Portfolio website"

# הוסף את ה-remote repository (החלף YOUR_USERNAME ו-YOUR_REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# שנה את שם ה-branch ל-main
git branch -M main

# העלה את הקבצים
git push -u origin main
```

**הערה**: אם GitHub יבקש ממך להתחבר, השתמש ב-GitHub CLI או ב-Personal Access Token.

### אפשרות ג': דרך GitHub Website (Drag & Drop)

1. פתח את ה-repository שיצרת ב-GitHub
2. לחץ על **"uploading an existing file"**
3. גרור את כל הקבצים מהתיקייה `C:\myWebsite` לחלון הדפדפן
4. לחץ **"Commit changes"**

## שלב 3: הפעלת GitHub Pages (להפוך את האתר לציבורי)

1. פתח את ה-repository ב-GitHub
2. לחץ על **Settings** (בתפריט העליון)
3. גלול למטה ל-**Pages** (בתפריט השמאלי)
4. תחת **Source**, בחר:
   - Branch: `main` (או `master`)
   - Folder: `/ (root)`
5. לחץ **Save**
6. חכה 1-2 דקות
7. האתר שלך יהיה זמין בכתובת:
   ```
   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
   ```

## קבצים שנוצרו

✅ **README.md** - תיעוד מלא של הפרויקט  
✅ **DEPLOY.md** - מדריך פרסום מפורט  
✅ **.gitignore** - קבצים שלא יועלו (קבצי מערכת, וכו')

## הערות חשובות

### קבצי תמונות
- כל התמונות בתיקייה יועלו ל-GitHub
- אם יש לך קבצים גדולים מאוד (מעל 100MB), שקול להשתמש ב-Git LFS
- תמונות שמועלות דרך ה-admin panel נשמרות ב-localStorage ולא יועלו

### אבטחה
- ה-admin panel (`admin.html`) יהיה נגיש לכל אחד שיודע את הכתובת
- אין הגנה על ה-admin panel - כל אחד יכול לערוך
- אם אתה רוצה הגנה, תצטרך להוסיף authentication

### נתונים (localStorage)
- כל הנתונים נשמרים בדפדפן של המשתמש
- אם אתה רוצה שהנתונים יישמרו ב-GitHub, תצטרך להוסיף backend
- כרגע, כל משתמש רואה את הנתונים שלו בלבד

## מה הלאה?

1. ✅ העלה את הקבצים ל-GitHub
2. ✅ הפעל GitHub Pages
3. ✅ בדוק שהאתר עובד
4. ✅ שתף את הקישור!

## בעיות נפוצות

**"Repository not found"**
- ודא שהקישור נכון
- ודא שיש לך הרשאות ל-repository

**"Large files"**
- GitHub מגביל קבצים ל-100MB
- אם יש קבצים גדולים, השתמש ב-Git LFS או הסר אותם

**"Pages not working"**
- ודא ש-GitHub Pages מופעל ב-Settings
- חכה כמה דקות - זה לוקח זמן
- בדוק את ה-URL - הוא צריך להיות בדיוק כמו שצוין

## עזרה נוספת

- [GitHub Docs](https://docs.github.com)
- [GitHub Pages Guide](https://docs.github.com/en/pages)
