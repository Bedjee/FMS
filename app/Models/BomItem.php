<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BomItem extends Model
{
    protected $fillable = [
        'product_id', 'wood_type', 'board_feet_required',
        'labor_cost', 'varnish_cost', 'other_cost'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
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
