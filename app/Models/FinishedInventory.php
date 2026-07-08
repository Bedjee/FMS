<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinishedInventory extends Model
{
    protected $table = 'finished_inventory';
    protected $fillable = ['product_variant_id', 'quantity', 'reserved_quantity', 'low_stock_threshold'];

    public function variant()
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }
}
