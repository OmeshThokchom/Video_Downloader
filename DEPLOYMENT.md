# 🚀 Deployment Guide

## GitHub Pages Deployment

### Option 1: Simple Static Deployment (Recommended)

1. **Create a new repository** on GitHub
2. **Upload these files** to your repository:
   ```
   ├── index.html              # Main application file
   ├── static/
   │   ├── css/
   │   │   └── style.css       # Custom styles
   │   └── js/
   │       ├── app.js          # Main application logic
   │       └── particles.js    # Particle animations
   ├── README.md               # Documentation
   └── .github/
       └── workflows/
           └── deploy.yml      # GitHub Actions workflow
   ```

3. **Enable GitHub Pages**:
   - Go to your repository Settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **Your site will be available at**: `https://yourusername.github.io/your-repo-name`

### Option 2: GitHub Actions Deployment

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: .
```

## Backend Deployment (Optional)

For full functionality with video analysis, deploy the backend:

### Heroku Deployment

1. **Create `Procfile`**:
   ```
   web: python app.py
   ```

2. **Create `runtime.txt`**:
   ```
   python-3.9.16
   ```

3. **Deploy to Heroku**:
   ```bash
   heroku create your-app-name
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

### Railway Deployment

1. **Connect your GitHub repository** to Railway
2. **Set environment variables**:
   - `PORT`: 5000
   - `HOST`: 0.0.0.0

3. **Deploy automatically** from your repository

### Vercel Deployment

1. **Create `vercel.json`**:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "app.py",
         "use": "@vercel/python"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "app.py"
       }
     ]
   }
   ```

2. **Deploy to Vercel**:
   ```bash
   npm i -g vercel
   vercel
   ```

## Environment Variables

Set these environment variables for production:

```bash
# Flask Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
HOST=0.0.0.0
PORT=5000

# Download Configuration
MAX_FILE_SIZE=1048576000  # 1GB
DOWNLOAD_TIMEOUT=300      # 5 minutes

# Security
ALLOWED_ORIGINS=https://yourdomain.com
RATE_LIMIT=100/hour
```

## CORS Configuration

For cross-origin requests, update your Flask app:

```python
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=['https://yourdomain.com', 'https://yourusername.github.io'])
```

## SSL/HTTPS Setup

### GitHub Pages
- Automatically includes SSL certificate
- No additional configuration needed

### Custom Domain
1. **Add custom domain** in GitHub Pages settings
2. **Enable HTTPS** (automatic with GitHub Pages)
3. **Update CORS origins** in backend

## Performance Optimization

### Frontend
- **Minify CSS/JS** for production
- **Enable gzip compression**
- **Use CDN** for external libraries

### Backend
- **Use production WSGI server** (Gunicorn)
- **Enable caching** for video info
- **Implement rate limiting**

## Monitoring

### GitHub Pages
- **Built-in analytics** in repository Insights
- **Custom analytics** with Google Analytics

### Backend
- **Log monitoring** with services like Loggly
- **Performance monitoring** with New Relic
- **Error tracking** with Sentry

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Update CORS origins in backend
   - Check domain configuration

2. **Download Failures**:
   - Verify yt-dlp installation
   - Check file permissions
   - Monitor server logs

3. **Performance Issues**:
   - Enable caching
   - Optimize database queries
   - Use CDN for static assets

### Support

- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Check README.md for detailed guides
- **Community**: Join discussions for help

---

**Happy Deploying! 🚀**
