<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add real-time fields to users table
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_online')->default(false)->after('language');
            $table->timestamp('last_seen_at')->nullable()->after('is_online');
            $table->unsignedBigInteger('current_chat_id')->nullable()->after('last_seen_at');
            
            $table->index('is_online');
            $table->index('last_seen_at');
        });

        // Add real-time fields to messages table
        Schema::table('messages', function (Blueprint $table) {
            $table->timestamp('delivered_at')->nullable()->after('file_path');
            $table->timestamp('read_at')->nullable()->after('delivered_at');
            
            $table->index(['chat_id', 'read_at']);
        });

        // Add typing status to chats table
        Schema::table('chats', function (Blueprint $table) {
            $table->json('typing_users')->nullable()->after('last_message_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['is_online', 'last_seen_at', 'current_chat_id']);
        });

        Schema::table('messages', function (Blueprint $table) {
            $table->dropColumn(['delivered_at', 'read_at']);
        });

        Schema::table('chats', function (Blueprint $table) {
            $table->dropColumn('typing_users');
        });
    }
};