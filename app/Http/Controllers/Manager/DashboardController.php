<?php

namespace App\Http\Controllers\Manager;
use App\Models\RawMaterial;
use App\Models\PurchaseOrder;
use App\Models\WorkOrder;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
   public function index()
    {
        $totalRawMaterials = RawMaterial::sum('board_feet');
        $activePurchaseOrders = PurchaseOrder::whereIn('status', ['draft', 'sent', 'confirmed'])->count();
        $pendingWorkOrders = WorkOrder::whereNotIn('status', ['completed', 'cancelled'])->count();

        return Inertia::render('Dashboard/Manager', [
            'stats' => [
                'totalRawMaterials' => round($totalRawMaterials, 2) . ' BF',
                'activePurchaseOrders' => $activePurchaseOrders,
                'pendingWorkOrders' => $pendingWorkOrders,
            ],
        ]);
    }
}
