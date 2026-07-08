<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number', 'customer_name', 'customer_phone', 'customer_address',
        'furniture_type', 'wood_type', 'length', 'width', 'height',
        'special_requests', 'suggested_price', 'final_price',
        'downpayment', 'balance', 'payment_status', 'production_status', 'manager_id'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($order) {
            $order->order_number = 'CUST-' . strtoupper(uniqid());
        });
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function workOrder()
    {
        return $this->hasOne(WorkOrder::class);
    }

    public function deliveries()
    {
        return $this->morphMany(Delivery::class, 'deliverable');
    }

    public function posTransactions()
    {
        return $this->hasMany(POSTransaction::class);
    }

    public function calculatePricing()
    {
        $bf = ($this->length * $this->width * ($this->height ?? 1)) / 12;
        $woodCost = $bf * 28;
        $laborCost = 1500;
        $varnishCost = 500;
        $otherCost = 300;
        $suggested = ($woodCost + $laborCost + $varnishCost + $otherCost) * 1.3;
        return [
            'suggested' => round($suggested, 2),
            'wood_cost' => $woodCost,
            'labor_cost' => $laborCost,
            'varnish_cost' => $varnishCost,
            'other_cost' => $otherCost
        ];
    }
}
