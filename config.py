# Quantum Video Downloader - Configuration File

import os

class Config:
    """Application configuration settings"""
    
    # Flask Configuration
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-change-this-in-production'
    DEBUG = os.environ.get('DEBUG', 'True').lower() == 'true'
    
    # Server Configuration
    HOST = os.environ.get('HOST', '0.0.0.0')
    PORT = int(os.environ.get('PORT', 5000))
    
    # Download Configuration
    MAX_FILE_SIZE = int(os.environ.get('MAX_FILE_SIZE', 500 * 1024 * 1024))  # 500MB
    TEMP_DIR = os.environ.get('TEMP_DIR', '/tmp')
    DOWNLOAD_TIMEOUT = int(os.environ.get('DOWNLOAD_TIMEOUT', 300))  # 5 minutes
    
    # yt-dlp Configuration
    YT_DLP_OPTIONS = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': True,
        'no_check_certificate': True,
        'prefer_ffmpeg': True,
    }
    
    # Supported video formats
    SUPPORTED_VIDEO_FORMATS = ['mp4', 'webm', 'mkv', 'avi', 'mov']
    SUPPORTED_AUDIO_FORMATS = ['mp3', 'm4a', 'webm', 'wav', 'aac']
    
    # UI Configuration
    PARTICLE_COUNT = int(os.environ.get('PARTICLE_COUNT', 100))
    MOUSE_RADIUS = int(os.environ.get('MOUSE_RADIUS', 150))
    CONNECTION_DISTANCE = int(os.environ.get('CONNECTION_DISTANCE', 150))
    
    # Security Configuration
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGINS', '*').split(',')
    RATE_LIMIT = os.environ.get('RATE_LIMIT', '100/hour')
    
    # Logging Configuration
    LOG_LEVEL = os.environ.get('LOG_LEVEL', 'INFO')
    LOG_FILE = os.environ.get('LOG_FILE', 'quantum_downloader.log')
    
    @staticmethod
    def init_app(app):
        """Initialize application with configuration"""
        pass

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    LOG_LEVEL = 'WARNING'
    
    # Production security settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or os.urandom(24)
    ALLOWED_ORIGINS = ['https://yourdomain.com', 'https://www.yourdomain.com']

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    TEMP_DIR = '/tmp/quantum_test'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
