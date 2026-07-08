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

    // Role-based redirect
    if ($user->hasRole('Owner')) {
        return redirect()->intended(route('owner.dashboard'));
    } elseif ($user->hasRole('Admin')) {
        return redirect()->intended(route('admin.dashboard'));  // <-- ADD THIS
    } elseif ($user->hasRole('Manager')) {
        return redirect()->intended(route('manager.dashboard'));
    } elseif ($user->hasRole('Supplier')) {
        return redirect()->intended(route('supplier.dashboard'));
    } elseif ($user->hasRole('Skiller')) {
        return redirect()->intended(route('skiller.dashboard'));
    } elseif ($user->hasRole('Carpenter')) {
        return redirect()->intended(route('carpenter.dashboard'));
    } elseif ($user->hasRole('Delivery Driver')) {
        return redirect()->intended(route('driver.dashboard'));
    } else {
        // Customer or fallback
        return redirect()->intended(route('shop'));
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
