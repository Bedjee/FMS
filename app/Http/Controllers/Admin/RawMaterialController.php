<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RawMaterial;
use Inertia\Inertia;

class RawMaterialController extends Controller
{
    public function index()
    {
        $materials = RawMaterial::with(['supplier', 'purchaseOrder', 'materialRequest'])
            ->orderBy('delivery_date', 'desc')
            ->paginate(15);

        $summary = [
            'Mahogany' => RawMaterial::where('wood_type', 'Mahogany')->sum('board_feet'),
            'Gemelina' => RawMaterial::where('wood_type', 'Gemelina')->sum('board_feet'),
        ];

        return Inertia::render('Admin/RawMaterials/Index', [
            'materials' => $materials,
            'summary' => $summary,
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
