<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // For customers we might redirect to the shop instead
        return redirect()->route('shop');
    }
}
