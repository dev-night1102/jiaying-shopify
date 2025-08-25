<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->string('file_path')->nullable()->after('image_path');
        });
        
        // Update the type enum to include 'file' - only for MySQL/PostgreSQL
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE messages MODIFY COLUMN type ENUM('text', 'image', 'file', 'system') DEFAULT 'text'");
        } elseif ($driver === 'pgsql') {
            // PostgreSQL enum handling would go here if needed
            // For now, we'll skip as most Laravel apps use MySQL for enums
        }
        // SQLite doesn't need enum modification - it accepts any string value
    }

    public function down(): void
    {
        // Revert the enum change - only for MySQL/PostgreSQL
        $driver = DB::getDriverName();
        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE messages MODIFY COLUMN type ENUM('text', 'image', 'system') DEFAULT 'text'");
        }
        
        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn('file_path');
        });
    }
};