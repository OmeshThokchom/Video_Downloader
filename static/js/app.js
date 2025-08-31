// Quantum Video Downloader - Main Application Logic

class VideoDownloader {
    constructor() {
        this.currentVideoInfo = null;
        this.currentUrl = '';
        this.selectedFormat = null;
        
        this.initializeElements();
        this.addEventListeners();
        this.addAnimations();
    }
    
    initializeElements() {
        this.elements = {
            videoUrl: document.getElementById('videoUrl'),
            searchBtn: document.getElementById('searchBtn'),
            loadingState: document.getElementById('loadingState'),
            errorState: document.getElementById('errorState'),
            errorMessage: document.getElementById('errorMessage'),
            videoResults: document.getElementById('videoResults'),
            videoThumbnail: document.getElementById('videoThumbnail'),
            videoTitle: document.getElementById('videoTitle'),
            videoUploader: document.getElementById('videoUploader'),
            videoViews: document.getElementById('videoViews'),
            videoDescription: document.getElementById('videoDescription'),
            videoDuration: document.getElementById('videoDuration'),
            videoFormats: document.getElementById('videoFormats'),
            audioFormats: document.getElementById('audioFormats'),
            downloadModal: document.getElementById('downloadModal'),
            downloadProgress: document.getElementById('downloadProgress')
        };
    }
    
    addEventListeners() {
        // Search button click
        this.elements.searchBtn.addEventListener('click', () => this.searchVideo());
        
        // Enter key in input field
        this.elements.videoUrl.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchVideo();
            }
        });
        
        // Input focus effects
        this.elements.videoUrl.addEventListener('focus', () => {
            this.elements.videoUrl.classList.add('input-focus');
        });
        
        this.elements.videoUrl.addEventListener('blur', () => {
            this.elements.videoUrl.classList.remove('input-focus');
        });
    }
    
    addAnimations() {
        // Add floating animation to header
        const header = document.querySelector('h1');
        if (header) {
            header.classList.add('float-animation');
        }
        
        // Add glow effect to search button
        this.elements.searchBtn.classList.add('glow-effect');
    }
    
    async searchVideo() {
        const url = this.elements.videoUrl.value.trim();
        
        if (!url) {
            this.showError('Please enter a valid video URL');
            return;
        }
        
        this.currentUrl = url;
        this.showLoading();
        this.hideError();
        this.hideResults();
        
        try {
            const response = await fetch('/api/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: url })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.currentVideoInfo = data;
                this.displayVideoInfo(data);
                this.showResults();
            } else {
                this.showError(data.error || 'Failed to analyze video');
            }
        } catch (error) {
            console.error('Search error:', error);
            this.showError('Network error. Please check your connection.');
        } finally {
            this.hideLoading();
        }
    }
    
    displayVideoInfo(videoInfo) {
        // Set video details
        this.elements.videoTitle.textContent = videoInfo.title;
        this.elements.videoUploader.querySelector('span').textContent = videoInfo.uploader;
        this.elements.videoViews.querySelector('span').textContent = this.formatNumber(videoInfo.view_count);
        this.elements.videoDescription.textContent = videoInfo.description;
        
        // Set thumbnail
        if (videoInfo.thumbnail) {
            this.elements.videoThumbnail.src = videoInfo.thumbnail;
            this.elements.videoThumbnail.onerror = () => {
                this.elements.videoThumbnail.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik0xNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBDMTYwIDkwIDE2MCA5MCAxNjAgOTBaIiBmaWxsPSIjNjc3NDg0Ii8+Cjx0ZXh0IHg9IjE2MCIgeT0iMTAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjc3NDg0IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiPk5vIFRodW1ibmFpbDwvdGV4dD4KPC9zdmc+';
            };
        }
        
        // Set duration
        if (videoInfo.duration) {
            this.elements.videoDuration.textContent = this.formatDuration(videoInfo.duration);
        }
        
        // Display video formats
        this.displayFormats(videoInfo.formats, this.elements.videoFormats, 'video');
        
        // Display audio formats
        this.displayFormats(videoInfo.audio_formats, this.elements.audioFormats, 'audio');
        
        // Add slide-in animation
        this.elements.videoResults.classList.add('slide-in');
    }
    
    displayFormats(formats, container, type) {
        container.innerHTML = '';
        
        if (!formats || formats.length === 0) {
            container.innerHTML = `
                <div class="text-center text-gray-400 py-8">
                    <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                    <p>No ${type} formats available</p>
                </div>
            `;
            return;
        }
        
        formats.forEach(format => {
            const formatElement = this.createFormatElement(format, type);
            container.appendChild(formatElement);
        });
    }
    
    createFormatElement(format, type) {
        const div = document.createElement('div');
        div.className = 'format-option interactive-element';
        
        const formatInfo = this.getFormatInfo(format, type);
        const fileSize = format.filesize ? this.formatFileSize(format.filesize) : 'Unknown size';
        
        div.innerHTML = `
            <div class="flex items-center justify-between">
                <div class="flex-1">
                    <div class="flex items-center space-x-3">
                        <i class="fas ${type === 'video' ? 'fa-video' : 'fa-music'} text-${type === 'video' ? 'blue' : 'green'}-400"></i>
                        <div>
                            <h4 class="font-semibold text-white">${formatInfo.quality}</h4>
                            <p class="text-sm text-gray-400">${format.ext.toUpperCase()} • ${fileSize}</p>
                        </div>
                    </div>
                </div>
                <button class="download-btn btn-hover-effect" data-format-id="${format.format_id}" data-type="${type}">
                    <i class="fas fa-download mr-2"></i>Download
                </button>
            </div>
        `;
        
        // Add click event for download
        const downloadBtn = div.querySelector('.download-btn');
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadFormat(format.format_id, type);
        });
        
        return div;
    }
    
    getFormatInfo(format, type) {
        if (type === 'video') {
            return {
                quality: format.resolution || 'Unknown Quality',
                info: `${format.ext.toUpperCase()} format`
            };
        } else {
            return {
                quality: format.abr ? `${format.abr}kbps` : 'Unknown Quality',
                info: `${format.ext.toUpperCase()} audio`
            };
        }
    }
    
    async downloadFormat(formatId, type) {
        if (!this.currentUrl || !formatId) {
            this.showError('Invalid download parameters');
            return;
        }
        
        this.showDownloadModal();
        
        try {
            const response = await fetch('/api/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: this.currentUrl,
                    format_id: formatId,
                    type: type
                })
            });
            
            if (response.ok) {
                // Create download link
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `downloaded_${type}_${formatId}.${type === 'video' ? 'mp4' : 'mp3'}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                this.showSuccess('Download completed successfully!');
            } else {
                const error = await response.json();
                this.showError(error.error || 'Download failed');
            }
        } catch (error) {
            console.error('Download error:', error);
            this.showError('Download failed. Please try again.');
        } finally {
            this.hideDownloadModal();
        }
    }
    
    // Utility functions
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    formatDuration(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // UI State Management
    showLoading() {
        this.elements.loadingState.classList.remove('hidden');
        this.elements.searchBtn.disabled = true;
        this.elements.searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...';
    }
    
    hideLoading() {
        this.elements.loadingState.classList.add('hidden');
        this.elements.searchBtn.disabled = false;
        this.elements.searchBtn.innerHTML = '<i class="fas fa-search mr-2"></i>Analyze';
    }
    
    showError(message) {
        this.elements.errorMessage.textContent = message;
        this.elements.errorState.classList.remove('hidden');
        this.elements.errorState.classList.add('slide-in');
    }
    
    hideError() {
        this.elements.errorState.classList.add('hidden');
    }
    
    showResults() {
        this.elements.videoResults.classList.remove('hidden');
    }
    
    hideResults() {
        this.elements.videoResults.classList.add('hidden');
    }
    
    showDownloadModal() {
        this.elements.downloadModal.classList.remove('hidden');
        this.simulateDownloadProgress();
    }
    
    hideDownloadModal() {
        this.elements.downloadModal.classList.add('hidden');
        this.elements.downloadProgress.style.width = '0%';
    }
    
    simulateDownloadProgress() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            this.elements.downloadProgress.style.width = progress + '%';
            
            if (progress >= 90) {
                clearInterval(interval);
            }
        }, 200);
    }
    
    showSuccess(message) {
        // Create success notification
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 slide-in';
        notification.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new VideoDownloader();
    
    // Add some additional interactive effects
    addInteractiveEffects();
});

function addInteractiveEffects() {
    // Add ripple effect to buttons
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) {
            createRippleEffect(e);
        }
    });
    
    // Add typing animation to placeholder
    const input = document.getElementById('videoUrl');
    const placeholders = [
        'https://www.youtube.com/watch?v=...',
        'https://vimeo.com/...',
        'https://www.dailymotion.com/video/...',
        'Paste any video URL here...'
    ];
    
    let placeholderIndex = 0;
    setInterval(() => {
        if (!input.matches(':focus')) {
            input.placeholder = placeholders[placeholderIndex];
            placeholderIndex = (placeholderIndex + 1) % placeholders.length;
        }
    }, 3000);
}

function createRippleEffect(e) {
    const button = e.target.tagName === 'BUTTON' ? e.target : e.target.closest('button');
    if (!button) return;
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
