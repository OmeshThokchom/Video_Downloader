# 🚀 Quick Start Guide

## Get Quantum Video Downloader Running in 3 Steps!

### Step 1: Install Dependencies
```bash
# Install yt-dlp (required for video downloading)
pip install yt-dlp

# Install Python dependencies
pip install -r requirements.txt
```

### Step 2: Start the Application
```bash
# Option A: Use the startup script (recommended)
./start.sh

# Option B: Run directly
python3 app.py
```

### Step 3: Open Your Browser
Navigate to: **http://localhost:5000**

That's it! 🎉

## 🎮 How to Use

1. **Paste a video URL** (YouTube, Vimeo, etc.)
2. **Click "Analyze"** to extract video information
3. **Choose your format** (video or audio quality)
4. **Click "Download"** and enjoy!

## 🧪 Test URLs

Try these demo URLs:
- `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
- `https://vimeo.com/148751763`

## 🛠️ Troubleshooting

**If you get "yt-dlp not found":**
```bash
pip install yt-dlp --upgrade
```

**If port 5000 is busy:**
```bash
# Edit app.py and change the port
app.run(debug=True, host='0.0.0.0', port=5001)
```

**If you get permission errors:**
```bash
chmod +x start.sh
chmod -R 755 static/
```

## 🎨 Features You'll Love

- ✨ **Interactive particle animations** that respond to your mouse
- 🎯 **Modern glass morphism design** with beautiful gradients
- 📱 **Fully responsive** - works on all devices
- ⚡ **Lightning fast** video analysis and downloads
- 🎵 **Multiple format support** - video and audio options
- 🔄 **Real-time progress** tracking with animations

## 🚀 Advanced Usage

### PHP Version
If you prefer PHP:
```bash
php -S localhost:8000
# Then visit http://localhost:8000
```

### Custom Configuration
Edit `config.py` to customize:
- Download limits
- Particle effects
- Server settings
- Security options

---

**Need help?** Check the full [README.md](README.md) for detailed documentation!

*Happy downloading! 🎬*
