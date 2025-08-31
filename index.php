<?php
// Quantum Video Downloader - PHP Backend
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Configuration
$config = [
    'yt_dlp_path' => 'yt-dlp', // Make sure yt-dlp is installed
    'temp_dir' => sys_get_temp_dir(),
    'max_file_size' => 500 * 1024 * 1024, // 500MB
];

// Helper functions
function isValidUrl($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

function formatFileSize($bytes) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, 2) . ' ' . $units[$pow];
}

function formatDuration($seconds) {
    $hours = floor($seconds / 3600);
    $minutes = floor(($seconds % 3600) / 60);
    $secs = $seconds % 60;
    
    if ($hours > 0) {
        return sprintf('%d:%02d:%02d', $hours, $minutes, $secs);
    }
    return sprintf('%d:%02d', $minutes, $secs);
}

function executeCommand($command) {
    $output = [];
    $returnCode = 0;
    exec($command . ' 2>&1', $output, $returnCode);
    return ['output' => $output, 'return_code' => $returnCode];
}

function extractVideoInfo($url) {
    global $config;
    
    $command = sprintf(
        '%s --dump-json --no-warnings "%s"',
        $config['yt_dlp_path'],
        escapeshellarg($url)
    );
    
    $result = executeCommand($command);
    
    if ($result['return_code'] !== 0) {
        return ['error' => 'Failed to extract video information: ' . implode("\n", $result['output'])];
    }
    
    $jsonOutput = implode("\n", $result['output']);
    $videoInfo = json_decode($jsonOutput, true);
    
    if (!$videoInfo) {
        return ['error' => 'Invalid video information received'];
    }
    
    // Process formats
    $formats = [];
    $audioFormats = [];
    
    if (isset($videoInfo['formats'])) {
        foreach ($videoInfo['formats'] as $format) {
            $formatInfo = [
                'format_id' => $format['format_id'] ?? '',
                'ext' => $format['ext'] ?? '',
                'filesize' => $format['filesize'] ?? 0,
                'url' => $format['url'] ?? '',
            ];
            
            // Video formats
            if (in_array($format['ext'] ?? '', ['mp4', 'webm', 'mkv'])) {
                $formatInfo['resolution'] = $format['resolution'] ?? 'N/A';
                $formatInfo['quality'] = $format['quality'] ?? 0;
                $formats[] = $formatInfo;
            }
            
            // Audio formats
            if (in_array($format['ext'] ?? '', ['mp3', 'm4a', 'webm'])) {
                $formatInfo['abr'] = $format['abr'] ?? 0;
                $audioFormats[] = $formatInfo;
            }
        }
    }
    
    return [
        'title' => $videoInfo['title'] ?? 'Unknown Title',
        'duration' => $videoInfo['duration'] ?? 0,
        'thumbnail' => $videoInfo['thumbnail'] ?? '',
        'formats' => $formats,
        'audio_formats' => $audioFormats,
        'uploader' => $videoInfo['uploader'] ?? 'Unknown',
        'view_count' => $videoInfo['view_count'] ?? 0,
        'description' => substr($videoInfo['description'] ?? '', 0, 200) . '...'
    ];
}

function downloadVideo($url, $formatId) {
    global $config;
    
    $tempFile = tempnam($config['temp_dir'], 'video_');
    $outputTemplate = $tempFile . '.%(ext)s';
    
    $command = sprintf(
        '%s -f %s -o "%s" --no-warnings "%s"',
        $config['yt_dlp_path'],
        escapeshellarg($formatId),
        escapeshellarg($outputTemplate),
        escapeshellarg($url)
    );
    
    $result = executeCommand($command);
    
    if ($result['return_code'] !== 0) {
        return ['error' => 'Download failed: ' . implode("\n", $result['output'])];
    }
    
    // Find the downloaded file
    $files = glob($tempFile . '.*');
    if (empty($files)) {
        return ['error' => 'Downloaded file not found'];
    }
    
    $downloadedFile = $files[0];
    
    if (!file_exists($downloadedFile)) {
        return ['error' => 'Downloaded file does not exist'];
    }
    
    $fileSize = filesize($downloadedFile);
    if ($fileSize > $config['max_file_size']) {
        unlink($downloadedFile);
        return ['error' => 'File too large'];
    }
    
    return ['file' => $downloadedFile, 'size' => $fileSize];
}

// Route handling
$requestMethod = $_SERVER['REQUEST_METHOD'];
$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if ($requestMethod === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (strpos($requestPath, '/api/search') !== false) {
        // Search/analyze video
        $url = $input['url'] ?? '';
        
        if (empty($url)) {
            http_response_code(400);
            echo json_encode(['error' => 'Please provide a valid URL']);
            exit;
        }
        
        if (!isValidUrl($url)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid URL format']);
            exit;
        }
        
        $videoInfo = extractVideoInfo($url);
        
        if (isset($videoInfo['error'])) {
            http_response_code(400);
            echo json_encode(['error' => $videoInfo['error']]);
            exit;
        }
        
        echo json_encode($videoInfo);
        
    } elseif (strpos($requestPath, '/api/download') !== false) {
        // Download video
        $url = $input['url'] ?? '';
        $formatId = $input['format_id'] ?? '';
        $type = $input['type'] ?? 'video';
        
        if (empty($url) || empty($formatId)) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required parameters']);
            exit;
        }
        
        $result = downloadVideo($url, $formatId);
        
        if (isset($result['error'])) {
            http_response_code(500);
            echo json_encode(['error' => $result['error']]);
            exit;
        }
        
        // Send file to client
        $file = $result['file'];
        $fileName = basename($file);
        $extension = pathinfo($fileName, PATHINFO_EXTENSION);
        
        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="downloaded_' . $type . '_' . $formatId . '.' . $extension . '"');
        header('Content-Length: ' . $result['size']);
        header('Cache-Control: no-cache, must-revalidate');
        
        readfile($file);
        unlink($file); // Clean up temp file
        exit;
        
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
    }
    
} elseif ($requestMethod === 'GET') {
    if ($requestPath === '/' || $requestPath === '/index.html') {
        // Serve the main HTML page
        header('Content-Type: text/html');
        include 'templates/index.html';
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Not found']);
    }
    
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
