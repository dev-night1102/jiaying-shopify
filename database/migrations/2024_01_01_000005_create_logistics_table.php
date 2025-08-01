<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('logistics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->onDelete('cascade');
            $table->string('tracking_number')->nullable();
            $table->string('carrier')->nullable();
            $table->text('tracking_url')->nullable();
            $table->decimal('actual_weight', 8, 2)->nullable();
            $table->decimal('actual_shipping_cost', 10, 2)->nullable();
            $table->text('warehouse_notes')->nullable();
            $table->timestamps();
            
            $table->index('order_id');
            $table->index('tracking_number');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('logistics');
    }
};