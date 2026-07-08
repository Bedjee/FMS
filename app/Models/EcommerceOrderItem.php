<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EcommerceOrderItem extends Model
{
    protected $fillable = ['ecommerce_order_id', 'product_variant_id', 'quantity', 'price', 'subtotal'];

    protected static function booted()
    {
        static::creating(function ($item) {
            $item->subtotal = $item->quantity * $item->price;
        });
    }

    public function order()
    {
        return $this->belongsTo(EcommerceOrder::class, 'ecommerce_order_id');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class);
    }
}
