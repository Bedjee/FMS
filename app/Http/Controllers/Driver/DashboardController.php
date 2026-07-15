<?php

namespace App\Http\Controllers\Driver;

use App\Http\Controllers\Controller;
use App\Models\EcommerceOrder;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $driverId = Auth::id();

        $stats = [
            'assigned' => EcommerceOrder::where('delivery_personnel_id', $driverId)
                ->whereIn('fulfillment_status', ['processing', 'shipped'])
                ->count(),

            'inProgress' => EcommerceOrder::where('delivery_personnel_id', $driverId)
                ->where('fulfillment_status', 'shipped')
                ->count(),

            'completedToday' => EcommerceOrder::where('delivery_personnel_id', $driverId)
                ->where('fulfillment_status', 'delivered')
                ->whereDate('updated_at', today())
                ->count(),
        ];

        return Inertia::render('Dashboard/Driver', [
            'stats' => $stats,
        ]);
    }
}
