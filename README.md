# 🚀 Quantum Video Downloader

A modern, futuristic video downloader with advanced particle animations and sleek UI design. Download videos from multiple sources including YouTube, Vimeo, and more with beautiful visual effects and responsive design.

![Quantum Video Downloader](https://img.shields.io/badge/Status-Ready-brightgreen)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![PHP](https://img.shields.io/badge/PHP-7.4+-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎯 Core Functionality
- **Multi-Source Support**: Download from YouTube, Vimeo, Dailymotion, and more
- **Format Selection**: Choose from multiple video and audio quality options
- **Real-time Analysis**: Instant video information extraction
- **Thumbnail Display**: Show video previews with metadata
- **Progress Tracking**: Visual download progress with animations

### 🎨 Futuristic UI/UX
- **Particle Animation**: Interactive background with mouse-responsive particles
- **Glass Morphism**: Modern translucent design elements
- **Gradient Effects**: Beautiful color transitions and animations
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: 60fps animations with CSS3 and JavaScript
- **Interactive Elements**: Hover effects, ripple animations, and particle bursts

### 🔧 Technical Features
- **Dual Backend**: Python Flask and PHP versions available
- **Modern Stack**: HTML5, CSS3, JavaScript ES6+, Tailwind CSS
- **RESTful API**: Clean API endpoints for video processing
- **Error Handling**: Comprehensive error management and user feedback
- **File Management**: Automatic temporary file cleanup

## 📁 Project Structure

```
Video_Downloader/
├── 🐍 Backend Files
│   ├── app.py                 # Main Flask application (Python)
│   ├── index.php             # Alternative PHP backend
│   ├── config.py             # Configuration settings
│   └── requirements.txt      # Python dependencies
│
├── 🎨 Frontend Files
│   ├── templates/
│   │   └── index.html        # Main UI template with futuristic design
│   └── static/
│       ├── css/
│       │   └── style.css     # Custom animations & glass morphism effects
│       ├── js/
│       │   ├── app.js        # Main application logic & UI interactions
│       │   └── particles.js  # Interactive particle animation system
│       └── images/           # Static image assets
│
├── 🚀 Utility Files
│   ├── start.sh              # Easy startup script with dependency checks
│   ├── demo_urls.txt         # Test video URLs for development
│   ├── QUICK_START.md        # Quick start guide for immediate use
│   └── README.md             # This comprehensive documentation
│
└── 📚 Documentation
    └── .git/                 # Version control (Git repository)
```

### 🔧 File Descriptions

| File | Purpose | Technology |
|------|---------|------------|
| `app.py` | Main Flask backend with video processing API | Python/Flask |
| `index.php` | Alternative PHP backend for different hosting | PHP |
| `config.py` | Application configuration and settings | Python |
| `templates/index.html` | Main UI with particle animations | HTML5/Tailwind |
| `static/css/style.css` | Custom animations and glass morphism | CSS3 |
| `static/js/app.js` | Video processing and UI interactions | JavaScript ES6+ |
| `static/js/particles.js` | Interactive particle animation system | JavaScript/Canvas |
| `start.sh` | Automated startup with dependency checks | Bash |

## 🛠️ Installation

### Prerequisites
- Python 3.8+ (for Flask version) OR PHP 7.4+ (for PHP version)
- yt-dlp (required for video downloading)
- Modern web browser with JavaScript enabled

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/quantum-video-downloader.git
cd quantum-video-downloader
```

### Step 2: Install yt-dlp
```bash
# Using pip
pip install yt-dlp

# Or using system package manager
# Ubuntu/Debian
sudo apt install yt-dlp

# macOS
brew install yt-dlp

# Windows
# Download from https://github.com/yt-dlp/yt-dlp/releases
```

### Step 3: Choose Your Backend

#### Option A: Python Flask Backend
```bash
# Install Python dependencies
pip install -r requirements.txt

# Run the application
python app.py
```

#### Option B: PHP Backend
```bash
# Start PHP development server
php -S localhost:8000

# Or configure with Apache/Nginx
# Copy files to your web server directory
```

### Step 4: Access the Application
Open your browser and navigate to:
- Flask version: `http://localhost:5000`
- PHP version: `http://localhost:8000`

## 🎮 Usage

### 1. Enter Video URL
- Paste any supported video URL in the input field
- Supported platforms: YouTube, Vimeo, Dailymotion, and more
- Press Enter or click "Analyze" to proceed

### 2. View Video Information
- See video thumbnail, title, uploader, and view count
- Check video duration and description
- Browse available download formats

### 3. Choose Download Format
- **Video Formats**: Select quality (720p, 1080p, 4K, etc.)
- **Audio Formats**: Choose audio-only downloads (MP3, M4A)
- Each format shows file size and extension

### 4. Download
- Click the download button for your preferred format
- Watch the progress animation
- File will download to your default download folder

## 🎨 Customization

### 🎨 Visual Customization

#### Styling
The application uses Tailwind CSS for styling. You can customize:

```css
/* Modify colors in static/css/style.css */
:root {
  --primary-color: #06b6d4;
  --secondary-color: #3b82f6;
  --accent-color: #8b5cf6;
}
```

#### Particle Effects
Adjust particle animation in `static/js/particles.js`:

```javascript
// Modify particle count and behavior
this.particleCount = 100; // Change number of particles
this.mouseRadius = 150;   // Change mouse interaction radius
this.connectionDistance = 150; // Change connection line distance
```

#### Animation Speed
Control animation performance in `static/css/style.css`:

```css
/* Faster animations */
.interactive-element {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slower, more dramatic animations */
.interactive-element {
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Particle Effects
Adjust particle animation in `static/js/particles.js`:

```javascript
// Modify particle count and behavior
this.particleCount = 100; // Change number of particles
this.mouseRadius = 150;   // Change mouse interaction radius
```

### 🔧 Backend Configuration

#### Python Flask Configuration
Configure download settings in `app.py`:

```python
# Modify yt-dlp options
ydl_opts = {
    'quiet': True,
    'no_warnings': True,
    'extract_flat': True,
    'prefer_ffmpeg': True,
    'no_check_certificate': True,
}

# Server settings
app.run(debug=True, host='0.0.0.0', port=5000)
```

#### PHP Configuration
Configure settings in `index.php`:

```php
$config = [
    'yt_dlp_path' => 'yt-dlp',
    'temp_dir' => sys_get_temp_dir(),
    'max_file_size' => 500 * 1024 * 1024, // 500MB
];
```

#### Environment Variables
Set these environment variables for production:

```bash
export SECRET_KEY="your-secret-key-here"
export DEBUG="False"
export MAX_FILE_SIZE="1048576000"  # 1GB
export LOG_LEVEL="WARNING"
```

## 🔧 API Documentation

### RESTful Endpoints

#### 🔍 Search Video
Extract video information and available formats.

```http
POST /api/search
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID"
}
```

**Response:**
```json
{
  "title": "Video Title",
  "duration": 180,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "formats": [
    {
      "format_id": "best",
      "ext": "mp4",
      "resolution": "1920x1080",
      "filesize": 52428800,
      "quality": 1080
    }
  ],
  "audio_formats": [
    {
      "format_id": "bestaudio",
      "ext": "mp3",
      "filesize": 10485760,
      "abr": 128
    }
  ],
  "uploader": "Channel Name",
  "view_count": 1000000,
  "description": "Video description..."
}
```

#### 📥 Download Video
Download video in specified format.

```http
POST /api/download
Content-Type: application/json

{
  "url": "https://www.youtube.com/watch?v=VIDEO_ID",
  "format_id": "best",
  "type": "video"
}
```

**Response:** Binary file download

#### 🖼️ Get Thumbnail
Get video thumbnail as base64.

```http
GET /api/thumbnail/{encoded_url}
```

**Response:**
```json
{
  "thumbnail": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ..."
}
```

### Error Responses

```json
{
  "error": "Error message description"
}
```

**HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (invalid URL, missing parameters)
- `404` - Not Found (video not available)
- `500` - Internal Server Error (download failed)

## 🎯 Supported Platforms

- ✅ YouTube
- ✅ Vimeo
- ✅ Dailymotion
- ✅ Facebook
- ✅ Instagram
- ✅ Twitter
- ✅ TikTok
- ✅ And many more (via yt-dlp)

## 🚀 Performance Features

- **Lazy Loading**: Images and content load on demand
- **Optimized Animations**: Hardware-accelerated CSS animations
- **Efficient API**: Minimal server requests and responses
- **Memory Management**: Automatic cleanup of temporary files
- **Caching**: Browser-level caching for static assets

## 🔒 Security Features

- **Input Validation**: URL and format validation
- **File Size Limits**: Configurable maximum download size
- **Temporary Files**: Secure handling of downloaded content
- **CORS Support**: Proper cross-origin resource sharing
- **Error Handling**: Graceful error management

## 🐛 Troubleshooting & FAQ

### Common Issues

#### 1. yt-dlp not found
```bash
# Install yt-dlp globally
pip install yt-dlp --upgrade

# Or install system-wide
sudo apt install yt-dlp  # Ubuntu/Debian
brew install yt-dlp      # macOS
```

#### 2. Permission denied
```bash
# Fix file permissions
chmod +x app.py
chmod +x start.sh
chmod -R 755 static/
chmod -R 755 templates/
```

#### 3. Port already in use
```bash
# Change port in app.py
app.run(debug=True, host='0.0.0.0', port=5001)

# Or kill process using port 5000
sudo lsof -ti:5000 | xargs kill -9
```

#### 4. Download fails
- Check internet connection
- Verify video URL is accessible
- Ensure sufficient disk space
- Check yt-dlp is up to date
- Try different video format

#### 5. Particle animations not working
- Ensure JavaScript is enabled
- Check browser console for errors
- Try refreshing the page
- Verify all static files are accessible

#### 6. Slow performance
- Reduce particle count in `particles.js`
- Disable animations for low-end devices
- Check server resources
- Use lighter video formats

### Frequently Asked Questions

**Q: Can I download from any website?**
A: The application supports 1000+ sites via yt-dlp, including YouTube, Vimeo, Dailymotion, and more.

**Q: Is this legal to use?**
A: The tool is for downloading content you have permission to access. Always respect copyright and terms of service.

**Q: Why are some videos not downloadable?**
A: Some videos may have restrictions, geo-blocking, or require authentication.

**Q: Can I run this on a server?**
A: Yes! Use the production configuration and a proper WSGI server like Gunicorn.

**Q: How do I update yt-dlp?**
A: Run `pip install yt-dlp --upgrade` to get the latest version.

**Q: Can I customize the particle effects?**
A: Yes! Edit `static/js/particles.js` to modify particle count, colors, and behavior.

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### 🚀 Quick Start for Contributors

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/quantum-video-downloader.git
   cd quantum-video-downloader
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Test your changes thoroughly

4. **Commit your changes**
   ```bash
   git add .
   git commit -m 'Add amazing feature: brief description'
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/amazing-feature
   # Then create PR on GitHub
   ```

### 🎯 Areas for Contribution

- **UI/UX Improvements**: Better animations, responsive design
- **New Features**: Additional video sources, format support
- **Performance**: Optimize particle animations, reduce load times
- **Documentation**: Improve guides, add examples
- **Testing**: Add unit tests, integration tests
- **Bug Fixes**: Report and fix issues

### 📋 Development Guidelines

- Use meaningful commit messages
- Test on multiple browsers and devices
- Follow PEP 8 for Python code
- Use ESLint for JavaScript code
- Add comments for complex algorithms
- Update documentation for new features

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [yt-dlp](https://github.com/yt-dlp/yt-dlp) - Video downloading engine
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Font Awesome](https://fontawesome.com/) - Icon library
- [Flask](https://flask.palletsprojects.com/) - Python web framework

## 📞 Support & Community

### 🆘 Getting Help

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/yourusername/quantum-video-downloader/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/yourusername/quantum-video-downloader/discussions)
- 📧 **Email Support**: support@quantumdownloader.com
- 💬 **Discord Community**: [Join our server](https://discord.gg/quantumdownloader)

### 📚 Additional Resources

- 📖 **Documentation**: [Full API Docs](https://docs.quantumdownloader.com)
- 🎥 **Video Tutorials**: [YouTube Channel](https://youtube.com/@quantumdownloader)
- 🐦 **Twitter**: [@QuantumDownload](https://twitter.com/QuantumDownload)
- 📱 **Discord**: [Community Server](https://discord.gg/quantumdownloader)

### 🏆 Show Your Support

If you find this project helpful, please consider:

- ⭐ **Star the repository** on GitHub
- 🍕 **Buy us a coffee** via [Ko-fi](https://ko-fi.com/quantumteam)
- 💖 **Sponsor the project** on GitHub
- 📢 **Share with friends** and on social media

---

## 🏆 Changelog

### Version 1.0.0 (Current)
- ✨ Initial release with particle animations
- 🎨 Futuristic glass morphism UI design
- 🔧 Dual backend support (Python Flask + PHP)
- 📱 Fully responsive design
- ⚡ Real-time video analysis and download
- 🎯 Support for 1000+ video platforms

### Upcoming Features
- 🔐 User authentication system
- 📊 Download history and statistics
- 🎵 Audio extraction and conversion
- 🌐 Multi-language support
- 📱 Progressive Web App (PWA)
- 🤖 AI-powered format recommendations

---

**Made with ❤️ and lots of ☕ by the Quantum Team**

*Experience the future of video downloading today!* 🚀

---

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/yourusername/quantum-video-downloader?style=social)](https://github.com/yourusername/quantum-video-downloader)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/quantum-video-downloader?style=social)](https://github.com/yourusername/quantum-video-downloader)
[![GitHub issues](https://img.shields.io/github/issues/yourusername/quantum-video-downloader)](https://github.com/yourusername/quantum-video-downloader/issues)
[![GitHub license](https://img.shields.io/github/license/yourusername/quantum-video-downloader)](https://github.com/yourusername/quantum-video-downloader/blob/main/LICENSE)

</div>