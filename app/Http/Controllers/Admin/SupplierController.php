<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use App\Models\User;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function index()
    {
        $suppliers = Supplier::withCount('materials')->orderBy('name')->paginate(15);
        return Inertia::render('Admin/Suppliers/Index', ['suppliers' => $suppliers]);
    }

    public function create()
    {
        return Inertia::render('Admin/Suppliers/Create');
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'contact_person' => 'required|string|max:255',
        'email' => 'required|email|unique:suppliers,email|unique:users,email',
        'phone' => 'required|string|max:20',
        'address' => 'required|string',
        'category' => 'required|in:Wood,Varnish,Other',
        // Add password field if you want Admin to set it
        'password' => 'nullable|string|min:8',
    ]);

    DB::transaction(function () use ($validated) {
        // 1. Create supplier
        $supplier = Supplier::create([
            'name' => $validated['name'],
            'contact_person' => $validated['contact_person'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'category' => $validated['category'],
        ]);

        // 2. Create user account for the supplier
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'] ? bcrypt($validated['password']) : bcrypt('password'),
            'phone' => $validated['phone'],
            'address' => $validated['address'],
            'employee_id' => 'SUP-' . str_pad($supplier->id, 4, '0', STR_PAD_LEFT),
            'supplier_id' => $supplier->id,
        ]);

        // 3. Assign Supplier role
        $user->assignRole('Supplier');

        // 4. Optionally, send welcome email with credentials
    });

    return redirect()->route('admin.suppliers.index')
        ->with('success', 'Supplier added and user account created.');
}




    public function edit(Supplier $supplier)
    {
        return Inertia::render('Admin/Suppliers/Edit', ['supplier' => $supplier]);
    }

    public function update(Request $request, Supplier $supplier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'contact_person' => 'required|string|max:255',
            'email' => 'required|email|unique:suppliers,email,' . $supplier->id,
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'category' => 'required|in:Wood,Varnish,Other',
        ]);

        $supplier->update($validated);
        return redirect()->route('admin.suppliers.index')->with('success', 'Supplier updated.');
    }

    public function destroy(Supplier $supplier)
    {
        $supplier->delete();
        return back()->with('success', 'Supplier deleted.');
    }
}
