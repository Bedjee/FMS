<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class WorkOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'order_number', 'product_id', 'custom_order_id', 'manager_id',
        'assigned_carpenter_id', 'assigned_skiller_id', 'status',
        'planned_bf', 'actual_bf_used', 'quantity', 'notes'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($wo) {
            $wo->order_number = 'WO-' . strtoupper(uniqid());
        });
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function customOrder()
    {
        return $this->belongsTo(CustomOrder::class);
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function carpenter()
    {
        return $this->belongsTo(User::class, 'assigned_carpenter_id');
    }

    public function skiller()
    {
        return $this->belongsTo(User::class, 'assigned_skiller_id');
    }

    public function statusHistories()
    {
        return $this->hasMany(ProductionStatusHistory::class);
    }

    public function updateStatus($newStatus, $userId, $remarks = null)
    {
        $this->status = $newStatus;
        $this->save();

        ProductionStatusHistory::create([
            'work_order_id' => $this->id,
            'status' => $newStatus,
            'user_id' => $userId,
            'remarks' => $remarks
        ]);
    }

    public function canTransitionTo($newStatus)
    {
        $allowed = [
            'pending_skiller' => ['skiller_processing'],
            'skiller_processing' => ['awaiting_carpenter'],
            'awaiting_carpenter' => ['fabrication'],
            'fabrication' => ['wood_filling'],
            'wood_filling' => ['sanding'],
            'sanding' => ['varnishing'],
            'varnishing' => ['ready_for_delivery'],
            'ready_for_delivery' => ['completed']
        ];
        return in_array($newStatus, $allowed[$this->status] ?? []);
    }
}
