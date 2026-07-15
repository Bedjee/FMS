<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryZone;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeliveryZoneController extends Controller
{
    public function index()
    {
        $zones = DeliveryZone::orderBy('name')->paginate(15);
        return Inertia::render('Admin/DeliveryZones/Index', ['zones' => $zones]);
    }

    public function create()
    {
        return Inertia::render('Admin/DeliveryZones/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:delivery_zones,name',
            'fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        DeliveryZone::create($validated);
        return redirect()->route('admin.delivery-zones.index')->with('success', 'Zone created.');
    }

    public function edit(DeliveryZone $deliveryZone)
    {
        return Inertia::render('Admin/DeliveryZones/Edit', ['zone' => $deliveryZone]);
    }

    public function update(Request $request, DeliveryZone $deliveryZone)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:delivery_zones,name,' . $deliveryZone->id,
            'fee' => 'required|numeric|min:0',
            'is_active' => 'boolean',
        ]);

        $deliveryZone->update($validated);
        return redirect()->route('admin.delivery-zones.index')->with('success', 'Zone updated.');
    }

    public function destroy(DeliveryZone $deliveryZone)
    {
        $deliveryZone->delete();
        return back()->with('success', 'Zone deleted.');
    }
}
