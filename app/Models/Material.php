<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Material extends Model
{
    protected $fillable = [
        'supplier_id', 'name', 'description', 'unit',
        'price', 'stock_quantity', 'is_available'
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'decimal:2',
        'is_available' => 'boolean',
    ];

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function materialRequestItems()
    {
        return $this->hasMany(MaterialRequestItem::class);
    }


    public function bomItems()
    {
        return $this->hasMany(BomItem::class);
    }


    public function inventoryTransactions()
{
    return $this->hasMany(SupplierInventoryTransaction::class);
}

public function logTransaction($type, $quantity, $referenceType = null, $referenceId = null, $notes = null)
{
    return $this->inventoryTransactions()->create([
        'type' => $type,
        'quantity' => $quantity,
        'balance_after' => $this->stock_quantity,
        'reference_type' => $referenceType,
        'reference_id' => $referenceId,
        'notes' => $notes,
    ]);
}
}
