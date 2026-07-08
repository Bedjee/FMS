<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'description', 'base_price', 'sku', 'is_active', 'image'];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function bomItems()
    {
        return $this->hasMany(BomItem::class);
    }

    public function workOrders()
    {
        return $this->hasMany(WorkOrder::class);
    }
}
