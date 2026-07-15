<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RawMaterial;
use App\Models\MaterialInventory;
use App\Models\Material;
use Inertia\Inertia;

class RawMaterialController extends Controller
{
    public function index()
    {
        // 1. Get the delivery history (raw_materials)
        $materials = RawMaterial::with(['supplier', 'purchaseOrder', 'materialRequest'])
            ->orderBy('delivery_date', 'desc')
            ->paginate(15);

        // 2. Get current stock summary from material_inventories
        $summary = MaterialInventory::with('material')
            ->get()
            ->mapWithKeys(function ($item) {
                return [
                    $item->material->name => [
                        'total' => (float) $item->quantity,
                        'unit' => $item->unit ?? 'BF',
                    ]
                ];
            })
            ->toArray();

        // If empty, provide defaults (optional)
        if (empty($summary)) {
            $summary = [
                'Mahogany' => ['total' => 0, 'unit' => 'BF'],
                'Gemelina' => ['total' => 0, 'unit' => 'BF'],
                'Varnish' => ['total' => 0, 'unit' => 'Liters'],
            ];
        }

        return Inertia::render('Admin/RawMaterials/Index', [
            'materials' => $materials,          // delivery history
            'summary' => $summary,              // current balances
        ]);
    }

    public function show(RawMaterial $rawMaterial)
    {
        $rawMaterial->load(['supplier', 'purchaseOrder', 'materialRequest']);
        return Inertia::render('Admin/RawMaterials/Show', [
            'material' => $rawMaterial,
        ]);
    }
}
