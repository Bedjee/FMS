<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseOrderItem extends Model
{
   protected $fillable = [
    'purchase_order_id', 'wood_type', 'thickness', 'width', 'length',
    'quantity', 'unit_price', 'total_board_feet', 'line_total', 'material_id'
];



    public function material()
{
    return $this->belongsTo(Material::class);
}

    public function purchaseOrder()
    {
        return $this->belongsTo(PurchaseOrder::class);
    }
}
