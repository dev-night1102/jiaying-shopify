<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'user_id',
        'product_link',
        'notes',
        'status',
        'item_cost',
        'service_fee',
        'shipping_estimate',
        'total_cost',
        'quoted_at',
        'paid_at',
        'purchased_at',
        'shipped_at',
        'delivered_at',
    ];

    protected $casts = [
        'item_cost' => 'decimal:2',
        'service_fee' => 'decimal:2',
        'shipping_estimate' => 'decimal:2',
        'total_cost' => 'decimal:2',
        'quoted_at' => 'datetime',
        'paid_at' => 'datetime',
        'purchased_at' => 'datetime',
        'shipped_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($order) {
            $order->order_number = 'ORD-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(OrderImage::class);
    }

    public function logistics()
    {
        return $this->hasOne(Logistics::class);
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function calculateTotalCost(): void
    {
        $this->total_cost = ($this->item_cost ?? 0) + ($this->service_fee ?? 0) + ($this->shipping_estimate ?? 0);
    }

    public function canBeQuoted(): bool
    {
        return $this->status === 'requested';
    }

    public function canBeAccepted(): bool
    {
        return $this->status === 'quoted';
    }

    public function canBePaid(): bool
    {
        return $this->status === 'accepted';
    }

    public function isPaid(): bool
    {
        return in_array($this->status, ['paid', 'purchased', 'inspected', 'shipped', 'delivered']);
    }
}