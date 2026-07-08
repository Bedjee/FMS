<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
    'po_number', 'supplier_id', 'created_by', 'status',
    'order_date', 'expected_delivery', 'notes', 'material_request_id'
];



    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items()
    {
        return $this->hasMany(PurchaseOrderItem::class);
    }

    public function materialRequest()
{
    return $this->belongsTo(MaterialRequest::class);
}
}
