<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Logistics extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'tracking_number',
        'carrier',
        'tracking_url',
        'actual_weight',
        'actual_shipping_cost',
        'warehouse_notes',
    ];

    protected $casts = [
        'actual_weight' => 'decimal:2',
        'actual_shipping_cost' => 'decimal:2',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}