<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class MaterialRequest extends Model
{
    protected $fillable = [
    'request_number', 'admin_id', 'manager_id','supplier_id', 'status',
    'request_date', 'notes', 'rejection_reason',
    'approved_at', 'rejected_at', 'purchase_order_id'
];

    protected $casts = [
        'request_date' => 'date',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($request) {
            $request->request_number = 'MR-' . strtoupper(uniqid());
        });
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function items()
    {
        return $this->hasMany(MaterialRequestItem::class);
    }

    public function rawMaterials()
    {
        return $this->hasMany(RawMaterial::class);
    }

    // Add the supplier relationship
    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function approve($managerId)
    {
        $this->status = 'approved';
        $this->manager_id = $managerId;
        $this->approved_at = now();
        $this->save();
    }

    public function reject($managerId, $reason)
    {
        $this->status = 'rejected';
        $this->manager_id = $managerId;
        $this->rejection_reason = $reason;
        $this->rejected_at = now();
        $this->save();
    }


    public function purchaseOrder()
{
    return $this->belongsTo(PurchaseOrder::class);
}


}
