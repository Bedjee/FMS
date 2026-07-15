<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BomItem extends Model
{
    protected $fillable = ['product_id', 'material_id', 'quantity', 'unit', 'notes'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

     // Add this relationship
    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public static function calculateCost($productId, $quantity = 1)
    {
        $items = self::where('product_id', $productId)->get();
        $total = 0;
        foreach ($items as $item) {
            $total += ($item->board_feet_required * 28) + $item->labor_cost + $item->varnish_cost + $item->other_cost;
        }
        return $total * $quantity;
    }
}
