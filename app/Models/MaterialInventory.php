<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MaterialInventory extends Model
{
    protected $table = 'material_inventories';
    protected $fillable = ['material_id', 'quantity', 'unit'];

    public function material()
    {
        return $this->belongsTo(Material::class);
    }

    public function transactions()
    {
        return $this->hasMany(MaterialInventoryTransaction::class);
    }

    public static function getStock($materialId)
    {
        $inventory = self::where('material_id', $materialId)->first();
        return $inventory ? $inventory->quantity : 0;
    }

    public static function add($materialId, $quantity, $referenceType = null, $referenceId = null, $notes = null)
    {
        $inventory = self::firstOrNew(['material_id' => $materialId]);
        if (!$inventory->unit) {
            $material = Material::find($materialId);
            $inventory->unit = $material->unit ?? 'units';
        }
        $inventory->quantity += $quantity;
        $inventory->save();

        // Log transaction
        $inventory->transactions()->create([
            'material_id' => $materialId,
            'type' => 'stock_in',
            'quantity' => $quantity,
            'balance_after' => $inventory->quantity,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
            'created_by' => auth()->id(),
        ]);

        return true;
    }

    public static function deduct($materialId, $quantity, $referenceType = null, $referenceId = null, $notes = null)
    {
        $inventory = self::where('material_id', $materialId)->first();
        if (!$inventory) {
            throw new \Exception('Material not found in inventory.');
        }
        if ($inventory->quantity < $quantity) {
            throw new \Exception('Insufficient stock for material: ' . $inventory->material->name);
        }
        $inventory->quantity -= $quantity;
        $inventory->save();

        // Log transaction
        $inventory->transactions()->create([
            'material_id' => $materialId,
            'type' => 'stock_out',
            'quantity' => $quantity,
            'balance_after' => $inventory->quantity,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
            'notes' => $notes,
            'created_by' => auth()->id(),
        ]);

        return true;
    }
}
