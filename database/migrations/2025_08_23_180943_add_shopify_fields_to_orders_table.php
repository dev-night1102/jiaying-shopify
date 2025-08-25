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
        Schema::table('orders', function (Blueprint $table) {
            // Shopify integration fields
            $table->string('shopify_order_id')->nullable()->index();
            $table->string('shopify_order_name')->nullable();
            $table->string('shopify_checkout_id')->nullable()->index();
            $table->string('shopify_draft_order_id')->nullable();
            $table->text('checkout_url')->nullable();
            $table->timestamp('checkout_created_at')->nullable();
            $table->timestamp('checkout_completed_at')->nullable();
            
            // Payment tracking fields
            $table->string('payment_status')->default('pending')->index(); // pending, paid, failed, cancelled, refunded
            // Skip service_fee and paid_at - they already exist in the original orders table
            $table->decimal('refunded_amount', 10, 2)->nullable();
            $table->timestamp('refunded_at')->nullable();
            $table->string('cancel_reason')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->boolean('refund_to_balance')->default(false);
            $table->string('refund_status')->default('none')->index(); // none, requested, approved, processed, refunded
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn([
                'shopify_order_id',
                'shopify_order_name', 
                'shopify_checkout_id',
                'shopify_draft_order_id',
                'checkout_url',
                'checkout_created_at',
                'checkout_completed_at',
                'payment_status',
                // Skip service_fee - it's part of the original table
                'refunded_amount',
                'refunded_at',
                'cancel_reason',
                'cancelled_at',
                'refund_to_balance',
                'refund_status'
            ]);
        });
    }
};
