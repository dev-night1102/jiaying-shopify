<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['trial', 'paid']);
            $table->enum('status', ['active', 'expired', 'cancelled'])->default('active');
            $table->datetime('started_at');
            $table->datetime('expires_at');
            $table->decimal('amount_paid', 10, 2)->nullable();
            $table->string('payment_reference')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index('expires_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};