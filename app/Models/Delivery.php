<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Delivery extends Model
{
    protected $fillable = [
        'deliverable_type', 'deliverable_id', 'driver_id', 'status',
        'assigned_at', 'out_for_delivery_at', 'delivered_at', 'delivery_notes'
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'out_for_delivery_at' => 'datetime',
        'delivered_at' => 'datetime',
    ];

    public function deliverable()
    {
        return $this->morphTo();
    }

    public function driver()
    {
        return $this->belongsTo(User::class, 'driver_id');
    }

    public function updateStatus($newStatus)
    {
        $this->status = $newStatus;
        if ($newStatus === 'out_for_delivery' && !$this->out_for_delivery_at) {
            $this->out_for_delivery_at = now();
        } elseif ($newStatus === 'delivered' && !$this->delivered_at) {
            $this->delivered_at = now();
        }
        $this->save();
    }
}
