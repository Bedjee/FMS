<?php

namespace App\Http\Controllers\Skiller;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Dashboard/Skiller');
    }
}
