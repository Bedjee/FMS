<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class POSTransaction extends Model
{
    protected $fillable = [
        'transaction_number', 'user_id', 'custom_order_id', 'customer_name',
        'total_amount', 'paid_amount', 'change_amount', 'payment_method', 'transaction_type'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($transaction) {
            $transaction->transaction_number = 'POS-' . strtoupper(uniqid());
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function customOrder()
    {
        return $this->belongsTo(CustomOrder::class);
    }

    public function items()
    {
        return $this->hasMany(POSTransactionItem::class);
    }
}
