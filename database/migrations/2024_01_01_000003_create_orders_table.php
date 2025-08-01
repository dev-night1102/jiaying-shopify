<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('product_link');
            $table->text('notes')->nullable();
            $table->enum('status', [
                'requested',
                'quoted',
                'accepted',
                'rejected',
                'paid',
                'purchased',
                'inspected',
                'shipped',
                'delivered',
                'refunded',
                'cancelled'
            ])->default('requested');
            $table->decimal('item_cost', 10, 2)->nullable();
            $table->decimal('service_fee', 10, 2)->nullable();
            $table->decimal('shipping_estimate', 10, 2)->nullable();
            $table->decimal('total_cost', 10, 2)->nullable();
            $table->datetime('quoted_at')->nullable();
            $table->datetime('paid_at')->nullable();
            $table->datetime('purchased_at')->nullable();
            $table->datetime('shipped_at')->nullable();
            $table->datetime('delivered_at')->nullable();
            $table->timestamps();
            
            $table->index(['user_id', 'status']);
            $table->index('order_number');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};