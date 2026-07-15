<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialInventoryTransaction extends Model
{
    protected $fillable = [
        'material_inventory_id',
        'material_id',
        'type',
        'quantity',
        'balance_after',
        'reference_type',
        'reference_id',
        'notes',
        'created_by',
    ];

    public function inventory()
    {
        return $this->belongsTo(MaterialInventory::class, 'material_inventory_id');
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
