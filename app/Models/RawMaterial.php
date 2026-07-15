<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RawMaterial extends Model
{
    use SoftDeletes;

    protected $fillable = [
    'material_name', 'board_feet', 'unit', 'thickness', 'width', 'length',
    'supplier_id', 'purchase_order_id', 'material_request_id',
    'delivery_date', 'receipt_path', 'remarks'
];

    // protected static function booted()
    // {
    //     static::creating(function ($material) {
    //         if (!$material->board_feet) {
    //             $material->board_feet = ($material->thickness * $material->width * $material->length) / 12;
    //         }
    //     });
    // }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }

    public function materialRequest()
{
    return $this->belongsTo(MaterialRequest::class);
}
}
