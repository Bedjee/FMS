<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialRequestItem extends Model
{
   protected $fillable = [
    'material_request_id', 'item_type', 'wood_type',
    'description', 'quantity', 'unit', 'unit_price'
];

protected $casts = [
    'quantity' => 'float',
    'unit_price' => 'float',
];

    public function materialRequest()
    {
        return $this->belongsTo(MaterialRequest::class);
    }

    public function material()
    {
        return $this->belongsTo(Material::class);
    }
}
