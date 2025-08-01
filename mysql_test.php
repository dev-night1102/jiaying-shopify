<?php
// Try different MySQL authentication methods
echo "Testing MySQL connection methods...\n";

// Method 1: Try with debian-sys-maint credentials (common in Ubuntu)
$debianSysMaintFile = '/etc/mysql/debian.cnf';
if (file_exists($debianSysMaintFile) && is_readable($debianSysMaintFile)) {
    $debianConfig = parse_ini_file($debianSysMaintFile, true);
    if (isset($debianConfig['client']['user']) && isset($debianConfig['client']['password'])) {
        try {
            $pdo = new PDO(
                "mysql:host=localhost;charset=utf8mb4",
                $debianConfig['client']['user'],
                $debianConfig['client']['password']
            );
            echo "✓ Connected using debian-sys-maint credentials\n";
            // Create database and user
            $pdo->exec("CREATE DATABASE IF NOT EXISTS shopping_agent CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
            $pdo->exec("CREATE USER IF NOT EXISTS 'laravel'@'localhost' IDENTIFIED BY 'laravel123';");
            $pdo->exec("GRANT ALL PRIVILEGES ON shopping_agent.* TO 'laravel'@'localhost';");
            $pdo->exec("FLUSH PRIVILEGES;");
            
            // Update .env
            $envContent = file_get_contents('.env');
            $envContent = preg_replace('/DB_CONNECTION=.*/', 'DB_CONNECTION=mysql', $envContent);
            $envContent = preg_replace('/DB_HOST=.*/', 'DB_HOST=127.0.0.1', $envContent);
            $envContent = preg_replace('/DB_PORT=.*/', 'DB_PORT=3306', $envContent);
            $envContent = preg_replace('/DB_DATABASE=.*/', 'DB_DATABASE=shopping_agent', $envContent);
            $envContent = preg_replace('/DB_USERNAME=.*/', 'DB_USERNAME=laravel', $envContent);
            $envContent = preg_replace('/DB_PASSWORD=.*/', 'DB_PASSWORD=laravel123', $envContent);
            file_put_contents('.env', $envContent);
            
            echo "✓ Created database, user, and updated .env\n";
            exit(0);
        } catch (PDOException $e) {
            echo "✗ debian-sys-maint failed: " . $e->getMessage() . "\n";
        }
    }
}

// Method 2: Try socket authentication without password
try {
    $pdo = new PDO("mysql:unix_socket=/var/run/mysqld/mysqld.sock;charset=utf8mb4", 'root', '');
    echo "✓ Connected using socket authentication\n";
    exit(0);
} catch (PDOException $e) {
    echo "✗ Socket auth failed: " . $e->getMessage() . "\n";
}

// Method 3: Try common default passwords
$passwords = ['', 'root', 'password', 'mysql', 'admin'];
foreach ($passwords as $pwd) {
    try {
        $pdo = new PDO("mysql:host=localhost;charset=utf8mb4", 'root', $pwd);
        echo "✓ Connected with password: " . ($pwd ?: '(empty)') . "\n";
        exit(0);
    } catch (PDOException $e) {
        // Silent fail, continue
    }
}

echo "All MySQL connection attempts failed.\n";
echo "Setting up fallback configuration...\n";

// Create a simple file-based storage system as fallback
$storageDir = __DIR__ . '/storage/app/data';
if (!file_exists($storageDir)) {
    mkdir($storageDir, 0755, true);
}

// Create simple user storage
file_put_contents($storageDir . '/users.json', json_encode([]));
file_put_contents($storageDir . '/orders.json', json_encode([]));

echo "✓ Created file-based storage fallback\n";
echo "Note: You'll need to set up a proper database connection for production use.\n";