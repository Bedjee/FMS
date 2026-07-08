<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class POSTransactionItem extends Model
{
    protected $fillable = ['pos_transaction_id', 'product_variant_id', 'quantity', 'price', 'subtotal'];

    protected static function booted()
    {
        static::creating(function ($item) {
            $item->subtotal = $item->quantity * $item->price;
        });
    }

    public function transaction()
    {
        return $this->belongsTo(POSTransaction::class, 'pos_transaction_id');
    }

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
