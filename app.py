from flask import Flask, render_template, request, jsonify, send_file
import yt_dlp
import requests
import os
import json
import re
from urllib.parse import urlparse
import tempfile
from PIL import Image
import io
import base64

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Configure yt-dlp options
ydl_opts = {
    'quiet': True,
    'no_warnings': True,
    'extract_flat': True,
}

def is_valid_url(url):
    """Check if the URL is valid"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def extract_video_info(url):
    """Extract video information using yt-dlp"""
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            # Get thumbnail
            thumbnail_url = info.get('thumbnail', '')
            
            # Get available formats
            formats = []
            if 'formats' in info:
                for fmt in info['formats']:
                    if fmt.get('ext') in ['mp4', 'webm', 'mkv']:
                        formats.append({
                            'format_id': fmt.get('format_id', ''),
                            'ext': fmt.get('ext', ''),
                            'resolution': fmt.get('resolution', 'N/A'),
                            'filesize': fmt.get('filesize', 0),
                            'url': fmt.get('url', ''),
                            'quality': fmt.get('quality', 0)
                        })
            
            # Get audio formats
            audio_formats = []
            if 'formats' in info:
                for fmt in info['formats']:
                    if fmt.get('ext') in ['mp3', 'm4a', 'webm']:
                        audio_formats.append({
                            'format_id': fmt.get('format_id', ''),
                            'ext': fmt.get('ext', ''),
                            'filesize': fmt.get('filesize', 0),
                            'url': fmt.get('url', ''),
                            'abr': fmt.get('abr', 0)
                        })
            
            return {
                'title': info.get('title', 'Unknown Title'),
                'duration': info.get('duration', 0),
                'thumbnail': thumbnail_url,
                'formats': formats,
                'audio_formats': audio_formats,
                'uploader': info.get('uploader', 'Unknown'),
                'view_count': info.get('view_count', 0),
                'description': info.get('description', '')[:200] + '...' if info.get('description') else ''
            }
    except Exception as e:
        return {'error': str(e)}

def download_video(url, format_id, output_path):
    """Download video with specified format"""
    try:
        download_opts = {
            'format': format_id,
            'outtmpl': output_path,
            'quiet': True,
        }
        
        with yt_dlp.YoutubeDL(download_opts) as ydl:
            ydl.download([url])
        
        return True
    except Exception as e:
        print(f"Download error: {e}")
        return False

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/search', methods=['POST'])
def search_video():
    data = request.get_json()
    url = data.get('url', '').strip()
    
    if not url:
        return jsonify({'error': 'Please provide a valid URL'}), 400
    
    if not is_valid_url(url):
        return jsonify({'error': 'Invalid URL format'}), 400
    
    video_info = extract_video_info(url)
    
    if 'error' in video_info:
        return jsonify({'error': video_info['error']}), 400
    
    return jsonify(video_info)

@app.route('/api/download', methods=['POST'])
def download():
    data = request.get_json()
    url = data.get('url')
    format_id = data.get('format_id')
    file_type = data.get('type', 'video')  # 'video' or 'audio'
    
    if not all([url, format_id]):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        # Create temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix='.mp4') as tmp_file:
            output_path = tmp_file.name
        
        # Download the file
        success = download_video(url, format_id, output_path)
        
        if success and os.path.exists(output_path):
            return send_file(output_path, as_attachment=True, download_name=f'downloaded_video.{format_id}.mp4')
        else:
            return jsonify({'error': 'Download failed'}), 500
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/thumbnail/<path:url>')
def get_thumbnail(url):
    """Get thumbnail as base64 for display"""
    try:
        response = requests.get(url)
        if response.status_code == 200:
            # Convert to base64
            img_data = base64.b64encode(response.content).decode('utf-8')
            return jsonify({'thumbnail': f'data:image/jpeg;base64,{img_data}'})
    except:
        pass
    return jsonify({'error': 'Failed to load thumbnail'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
