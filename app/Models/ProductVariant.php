<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
    protected $fillable = ['product_id', 'wood_type', 'price', 'stock_quantity', 'low_stock_threshold'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function inventory()
    {
        return $this->hasOne(FinishedInventory::class);
    }

    public function posTransactionItems()
    {
        return $this->hasMany(POSTransactionItem::class);
    }

    public function ecommerceOrderItems()
    {
        return $this->hasMany(EcommerceOrderItem::class);
    }

    public function decreaseStock($quantity)
    {
        $this->decrement('stock_quantity', $quantity);
        if ($this->inventory) {
            $this->inventory->decrement('quantity', $quantity);
        }
    }
}
