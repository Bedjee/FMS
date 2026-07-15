<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariant extends Model
{
   protected $fillable = ['product_id', 'wood_type','dimensions', 'finish', 'price', 'stock_quantity', 'low_stock_threshold'];



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

   public function transactions()
{
    return $this->hasMany(ProductInventoryTransaction::class, 'product_variant_id');
}

public function logTransaction($type, $quantity, $referenceType = null, $referenceId = null, $notes = null)
{
    return $this->transactions()->create([
        'type' => $type,
        'quantity' => $quantity,
        'balance_after' => $this->stock_quantity,
        'reference_type' => $referenceType,
        'reference_id' => $referenceId,
        'notes' => $notes,
    ]);
}


}
