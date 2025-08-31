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
        # Use more detailed extraction options
        detailed_opts = {
            'quiet': True,
            'no_warnings': True,
            'extract_flat': False,  # Get full format info
        }
        
        with yt_dlp.YoutubeDL(detailed_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            
            if not info:
                return {'error': 'Could not extract video information'}
            
            # Get thumbnail
            thumbnail_url = info.get('thumbnail', '')
            
            # Get available formats and filter to quality levels
            all_formats = []
            if 'formats' in info and info['formats']:
                for fmt in info['formats']:
                    if fmt.get('ext') in ['mp4', 'webm', 'mkv']:
                        # Ensure height is a valid number
                        height = fmt.get('height')
                        if height is not None:
                            try:
                                height = int(height)
                            except (ValueError, TypeError):
                                height = 0
                        
                        # Try to get filesize from multiple sources
                        filesize = fmt.get('filesize', 0)
                        if not filesize:
                            filesize = fmt.get('filesize_approx', 0)
                        
                        all_formats.append({
                            'format_id': fmt.get('format_id', ''),
                            'ext': fmt.get('ext', ''),
                            'resolution': fmt.get('resolution', 'N/A'),
                            'filesize': filesize,
                            'url': fmt.get('url', ''),
                            'quality': fmt.get('quality', 0),
                            'height': height or 0
                        })
            
            # Filter and categorize formats into Low, Standard, High
            formats = filter_formats_by_quality(all_formats)
            
            # Get audio formats - prioritize MP3 conversion
            audio_formats = []
            
            # Always provide MP3 option using bestaudio format
            audio_formats.append({
                'format_id': 'bestaudio/best',
                'ext': 'mp3',
                'filesize': 0,  # Will be calculated during download
                'url': '',
                'abr': 192,
                'quality_label': 'MP3 Audio',
                'quality_display': 'High Quality MP3 (192kbps)'
            })
            
            # Also add other available audio formats if they exist
            if 'formats' in info and info['formats']:
                for fmt in info['formats']:
                    if (fmt.get('ext') in ['mp3', 'm4a', 'webm'] and 
                        fmt.get('acodec') != 'none' and 
                        fmt.get('vcodec') == 'none'):
                        
                        # Try to get filesize
                        filesize = fmt.get('filesize', 0)
                        if not filesize:
                            filesize = fmt.get('filesize_approx', 0)
                        
                        # Skip if it's already a WEBM (we prefer MP3)
                        if fmt.get('ext') != 'webm':
                            audio_formats.append({
                                'format_id': fmt.get('format_id', ''),
                                'ext': fmt.get('ext', ''),
                                'filesize': filesize,
                                'url': fmt.get('url', ''),
                                'abr': fmt.get('abr', 0),
                                'quality_label': f'{fmt.get("ext", "").upper()} Audio',
                                'quality_display': f'{fmt.get("abr", 0)}kbps {fmt.get("ext", "").upper()}'
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
        print(f"Error extracting video info: {e}")
        return {'error': f'Failed to extract video information: {str(e)}'}

def filter_formats_by_quality(all_formats):
    """Filter formats into Low, Standard, High quality levels"""
    if not all_formats:
        return []
    
    # Filter out formats with None or invalid height values
    valid_formats = []
    for fmt in all_formats:
        height = fmt.get('height')
        if height is not None and isinstance(height, (int, float)) and height > 0:
            valid_formats.append(fmt)
    
    if not valid_formats:
        # If no valid formats, return original formats with default labels
        for fmt in all_formats:
            fmt['quality_label'] = 'Available'
            fmt['quality_display'] = f'Format ({fmt.get("ext", "Unknown").upper()})'
        return all_formats
    
    # Sort by height (quality)
    sorted_formats = sorted(valid_formats, key=lambda x: x.get('height', 0))
    
    # Define quality levels
    quality_levels = {
        'Low': {'min_height': 0, 'max_height': 480, 'label': 'Low Quality (480p)'},
        'Standard': {'min_height': 481, 'max_height': 720, 'label': 'Standard Quality (720p)'},
        'High': {'min_height': 721, 'max_height': float('inf'), 'label': 'High Quality (1080p+)'}
    }
    
    filtered_formats = []
    
    for quality_name, quality_range in quality_levels.items():
        # Find the best format for this quality level
        suitable_formats = [
            fmt for fmt in sorted_formats
            if quality_range['min_height'] <= fmt.get('height', 0) <= quality_range['max_height']
        ]
        
        if suitable_formats:
            # Get the best format for this quality level
            best_format = max(suitable_formats, key=lambda x: x.get('height', 0))
            best_format['quality_label'] = quality_name
            best_format['quality_display'] = quality_range['label']
            filtered_formats.append(best_format)
    
    # If no formats found, return the best available
    if not filtered_formats and sorted_formats:
        best_format = sorted_formats[-1]
        best_format['quality_label'] = 'Best Available'
        best_format['quality_display'] = f'Best Quality ({best_format.get("height", "Unknown")}p)'
        filtered_formats.append(best_format)
    
    return filtered_formats

def download_video(url, format_id, output_path):
    """Download video with specified format"""
    try:
        # Get video info first to get the title
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if not info:
                return False
            
            # Create a safe filename from the title
            title = info.get('title', 'video')
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_title = safe_title[:50]  # Limit length
            
            # Determine if this is an audio download
            is_audio = format_id.startswith('bestaudio') or 'audio' in format_id.lower()
            
            # Set up download options
            if is_audio:
                # For audio, we need to use a different approach to ensure MP3 output
                download_opts = {
                    'format': 'bestaudio/best',
                    'outtmpl': output_path.replace('.mp3', '.%(ext)s'),
                    'quiet': True,
                    'progress_hooks': [progress_hook],
                    'postprocessors': [{
                        'key': 'FFmpegExtractAudio',
                        'preferredcodec': 'mp3',
                        'preferredquality': '192',
                    }],
                }
            else:
                download_opts = {
                    'format': format_id,
                    'outtmpl': output_path,
                    'quiet': True,
                    'progress_hooks': [progress_hook],
                }
            
            # Download the file
            ydl.download([url])
            
            # For audio downloads, find the converted MP3 file
            if is_audio:
                import glob
                # Look for the MP3 file that was created
                mp3_files = glob.glob(output_path.replace('.mp3', '*.mp3'))
                if mp3_files:
                    # Move the MP3 file to the expected location
                    import shutil
                    shutil.move(mp3_files[0], output_path)
            
            # Check if file was downloaded successfully
            if os.path.exists(output_path):
                file_size = os.path.getsize(output_path)
                if file_size > 0:
                    print(f"Successfully downloaded: {output_path} ({file_size} bytes)")
                    return True
                else:
                    print(f"Downloaded file is empty: {output_path}")
                    return False
            else:
                print(f"Downloaded file not found: {output_path}")
                return False
            
    except Exception as e:
        print(f"Download error: {e}")
        return False

def progress_hook(d):
    """Progress hook for yt-dlp to track download progress"""
    if d['status'] == 'downloading':
        # Calculate progress percentage
        if 'total_bytes' in d and d['total_bytes']:
            progress = (d['downloaded_bytes'] / d['total_bytes']) * 100
            speed = d.get('speed', 0)
            eta = d.get('eta', 0)
            
            # You can implement WebSocket or Server-Sent Events here
            # to send real-time progress to the frontend
            print(f"Progress: {progress:.1f}% | Speed: {speed} | ETA: {eta}s")
    
    elif d['status'] == 'finished':
        print(f"Download completed: {d['filename']}")

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

@app.route('/api/get-download-url', methods=['POST'])
def get_download_url():
    """Get direct download URL for browser download"""
    data = request.get_json()
    url = data.get('url')
    format_id = data.get('format_id')
    file_type = data.get('type', 'video')
    
    if not all([url, format_id]):
        return jsonify({'error': 'Missing required parameters'}), 400
    
    try:
        # Get video info and direct download URL
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            if not info:
                return jsonify({'error': 'Could not get video information'}), 400
            
            # Find the specific format
            download_url = None
            filesize = 0
            
            if 'formats' in info and info['formats']:
                for fmt in info['formats']:
                    if fmt.get('format_id') == format_id:
                        download_url = fmt.get('url')
                        filesize = fmt.get('filesize', 0)
                        break
            
            # For audio downloads, use bestaudio format
            if file_type == 'audio' and not download_url:
                # Find best audio format
                for fmt in info['formats']:
                    if (fmt.get('acodec') != 'none' and 
                        fmt.get('vcodec') == 'none' and 
                        fmt.get('ext') in ['mp3', 'm4a']):
                        download_url = fmt.get('url')
                        filesize = fmt.get('filesize', 0)
                        break
            
            if not download_url:
                return jsonify({'error': 'Download URL not found'}), 400
            
            # Create filename
            title = info.get('title', 'video')
            safe_title = "".join(c for c in title if c.isalnum() or c in (' ', '-', '_')).rstrip()
            safe_title = safe_title[:50]
            
            if file_type == 'audio':
                filename = f"{safe_title}.mp3"
            else:
                filename = f"{safe_title}.mp4"
            
            return jsonify({
                'download_url': download_url,
                'filename': filename,
                'filesize': filesize,
                'title': title
            })
            
    except Exception as e:
        print(f"Error getting download URL: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/download', methods=['POST'])
def download():
    """Legacy download endpoint - redirects to get-download-url"""
    return get_download_url()

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

@app.route('/api/download-progress/<task_id>')
def get_download_progress(task_id):
    """Get download progress for a specific task"""
    # This would be implemented with a proper task queue system
    # For now, return mock progress
    return jsonify({
        'progress': 0,
        'status': 'starting',
        'speed': '0 B/s',
        'eta': 'Unknown'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
