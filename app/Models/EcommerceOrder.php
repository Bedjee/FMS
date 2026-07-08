<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EcommerceOrder extends Model
{
    protected $fillable = [
        'order_number', 'user_id', 'subtotal', 'shipping_fee', 'total',
        'downpayment_paid', 'cod_balance', 'payment_status', 'fulfillment_status',
        'shipping_address', 'tracking_code'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($order) {
            $order->order_number = 'ONLINE-' . strtoupper(uniqid());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(EcommerceOrderItem::class);
    }

    public function deliveries()
    {
        return $this->morphMany(Delivery::class, 'deliverable');
    }
}
