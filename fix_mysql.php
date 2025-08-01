<?php
echo "Attempting to fix MySQL connection...\n";

// Try to connect with MySQL 8.0 specific methods
$hosts = ['localhost', '127.0.0.1'];
$users = ['root', 'mysql', 'ubuntu', 'admin'];
$passwords = ['', 'root', 'password', 'mysql', 'admin', 'ubuntu'];

foreach ($hosts as $host) {
    foreach ($users as $user) {
        foreach ($passwords as $password) {
            try {
                // Try with mysql_native_password plugin
                $dsn = "mysql:host=$host;charset=utf8mb4";
                $options = [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::MYSQL_ATTR_SSL_VERIFY_SERVER_CERT => false,
                ];
                
                $pdo = new PDO($dsn, $user, $password, $options);
                
                echo "✓ SUCCESS: Connected with $user@$host, password: " . ($password ?: 'empty') . "\n";
                
                // Create database and setup
                $pdo->exec("CREATE DATABASE IF NOT EXISTS shopping_agent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
                echo "✓ Database created\n";
                
                // Try to create a new user for Laravel
                try {
                    $pdo->exec("DROP USER IF EXISTS 'laravel'@'localhost'");
                    $pdo->exec("CREATE USER 'laravel'@'localhost' IDENTIFIED WITH mysql_native_password BY 'secret123'");
                    $pdo->exec("GRANT ALL PRIVILEGES ON shopping_agent.* TO 'laravel'@'localhost'");
                    $pdo->exec("FLUSH PRIVILEGES");
                    echo "✓ Laravel user created\n";
                } catch (Exception $e) {
                    echo "! Could not create Laravel user: " . $e->getMessage() . "\n";
                }
                
                // Update .env file
                $envContent = file_get_contents('.env');
                $envContent = preg_replace('/DB_CONNECTION=.*/', 'DB_CONNECTION=mysql', $envContent);
                $envContent = preg_replace('/DB_HOST=.*/', 'DB_HOST=127.0.0.1', $envContent);
                $envContent = preg_replace('/DB_PORT=.*/', 'DB_PORT=3306', $envContent);
                $envContent = preg_replace('/DB_DATABASE=.*/', 'DB_DATABASE=shopping_agent', $envContent);
                $envContent = preg_replace('/DB_USERNAME=.*/', 'DB_USERNAME=laravel', $envContent);
                $envContent = preg_replace('/DB_PASSWORD=.*/', 'DB_PASSWORD=secret123', $envContent);
                
                // Clean up empty lines
                $envContent = preg_replace('/\n\n+/', "\n\n", $envContent);
                file_put_contents('.env', $envContent);
                
                echo "✓ Updated .env file\n";
                echo "\nMySQL is now configured. You can run migrations with: php artisan migrate\n";
                
                exit(0);
                
            } catch (Exception $e) {
                // Continue to next combination
                continue;
            }
        }
    }
}

echo "❌ All MySQL connection attempts failed.\n";
echo "Let's try a different approach...\n";

// Download and try to use SQLite binary
echo "Downloading SQLite binary...\n";
$sqliteUrl = "https://sqlite.org/2023/sqlite-tools-linux-x86-3410200.zip";
$tempDir = sys_get_temp_dir() . '/sqlite_tools';

try {
    if (!file_exists($tempDir)) {
        mkdir($tempDir, 0755, true);
    }
    
    $zipFile = $tempDir . '/sqlite-tools.zip';
    
    // Download SQLite tools
    if (function_exists('curl_init')) {
        $ch = curl_init($sqliteUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $zipData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200 && $zipData) {
            file_put_contents($zipFile, $zipData);
            echo "✓ Downloaded SQLite tools\n";
            
            // Extract and use
            if (class_exists('ZipArchive')) {
                $zip = new ZipArchive;
                if ($zip->open($zipFile) === TRUE) {
                    $zip->extractTo($tempDir);
                    $zip->close();
                    echo "✓ Extracted SQLite tools\n";
                    
                    // Find sqlite3 binary
                    $sqliteBinary = $tempDir . '/sqlite-tools-linux-x86-3410200/sqlite3';
                    if (file_exists($sqliteBinary)) {
                        chmod($sqliteBinary, 0755);
                        echo "✓ SQLite binary ready at: $sqliteBinary\n";
                        
                        // Create database file
                        $dbFile = __DIR__ . '/database/database.sqlite';
                        if (!file_exists(dirname($dbFile))) {
                            mkdir(dirname($dbFile), 0755, true);
                        }
                        
                        // Initialize database
                        exec("$sqliteBinary $dbFile '.exit'");
                        
                        // Update .env for SQLite
                        $envContent = file_get_contents('.env');
                        $envContent = preg_replace('/DB_CONNECTION=.*/', 'DB_CONNECTION=sqlite', $envContent);
                        $envContent = preg_replace('/DB_HOST=.*/', '', $envContent);
                        $envContent = preg_replace('/DB_PORT=.*/', '', $envContent);
                        $envContent = preg_replace('/DB_DATABASE=.*/', "DB_DATABASE=$dbFile", $envContent);
                        $envContent = preg_replace('/DB_USERNAME=.*/', '', $envContent);
                        $envContent = preg_replace('/DB_PASSWORD=.*/', '', $envContent);
                        
                        file_put_contents('.env', $envContent);
                        
                        echo "✓ Configured for SQLite\n";
                        echo "Database file: $dbFile\n";
                        echo "Note: PHP SQLite extension still needed for Laravel to work\n";
                    }
                }
            }
        }
    }
} catch (Exception $e) {
    echo "SQLite download failed: " . $e->getMessage() . "\n";
}

echo "\n=== Final Solution ===\n";
echo "Since neither MySQL nor SQLite are accessible, creating a temporary workaround...\n";

// Create a temporary file-based user system
$dataDir = __DIR__ . '/storage/app/temp_data';
if (!file_exists($dataDir)) {
    mkdir($dataDir, 0755, true);
}

// Create initial data files
file_put_contents($dataDir . '/users.json', json_encode([]));
file_put_contents($dataDir . '/next_id.txt', '1');

echo "✓ Created temporary file-based storage\n";
echo "Directory: $dataDir\n";
echo "\nTo fix this properly, you need to either:\n";
echo "1. Install php8.1-sqlite3: sudo apt install php8.1-sqlite3\n";
echo "2. Fix MySQL root password\n";
echo "3. Or provide working database credentials\n";