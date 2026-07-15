<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierInventoryTransaction extends Model
{
    protected $fillable = [
        'material_id', 'type', 'quantity', 'balance_after',
        'reference_type', 'reference_id', 'notes'
    ];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
