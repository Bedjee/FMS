<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
 public function store(LoginRequest $request): RedirectResponse
{
    $request->authenticate();
    $request->session()->regenerate();

    $user = Auth::user();

    if ($user->hasRole('Owner')) {
        return redirect()->route('owner.dashboard');
    } elseif ($user->hasRole('Admin')) {
        return redirect()->route('admin.dashboard');
    } elseif ($user->hasRole('Manager')) {
        return redirect()->route('manager.dashboard');
    } elseif ($user->hasRole('Supplier')) {
        return redirect()->route('supplier.dashboard');
    } elseif ($user->hasRole('Skiller')) {
        return redirect()->route('skiller.dashboard');
    } elseif ($user->hasRole('Carpenter')) {
        return redirect()->route('carpenter.dashboard');
    } elseif ($user->hasRole('Delivery Driver')) {
        return redirect()->route('driver.dashboard');
    } else {
        // Customer or fallback
        return redirect()->route('customer.dashboard');
    }
}

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
