<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EcommerceOrder extends Model
{
    protected $fillable = [
    'order_number', 'user_id', 'subtotal', 'shipping_fee', 'total',
    'downpayment_paid', 'cod_balance', 'payment_status', 'fulfillment_status', // <-- add this
    'shipping_address', 'tracking_code', 'payment_method',
    'recipient_name', 'contact_number', 'province', 'city', 'barangay',
    'street_address', 'postal_code', 'delivery_zone_id','delivery_personnel_id','revenue_recorded','proof_of_delivery',
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

    public function deliveryZone()
{
    return $this->belongsTo(DeliveryZone::class);
}

public function deliveryPersonnel()
{
    return $this->belongsTo(User::class, 'delivery_personnel_id');
}
}
