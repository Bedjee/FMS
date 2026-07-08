<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Owner\DashboardController as OwnerDashboardController;
use App\Http\Controllers\Manager\DashboardController as ManagerDashboardController;
use App\Http\Controllers\Supplier\DashboardController as SupplierDashboardController;
use App\Http\Controllers\Skiller\DashboardController as SkillerDashboardController;
use App\Http\Controllers\Carpenter\DashboardController as CarpenterDashboardController;
use App\Http\Controllers\Driver\DashboardController as DriverDashboardController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Manager\MaterialRequestController as ManagerMaterialRequestController;
use App\Http\Controllers\Admin\MaterialRequestController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\SupplierController as AdminSupplierController;
use App\Http\Controllers\Manager\MaterialController;

use App\Http\Controllers\Manager\RawMaterialController;
use App\Http\Controllers\Supplier\MaterialController as SupplierMaterialController;
use App\Http\Controllers\Supplier\PurchaseOrderController as SupplierPurchaseOrderController;
use App\Http\Controllers\Manager\PurchaseOrderController;
use App\Http\Controllers\Manager\ProductController;
use App\Http\Controllers\Admin\RawMaterialController as AdminRawMaterialController ;
use App\Http\Controllers\Manager\WorkOrderController;
use App\Http\Controllers\Manager\PDFController;



use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => ['user' => auth()->user()],
    ]);
})->name('home');

Route::get('/shop', function () {
    return Inertia::render('Ecommerce/Shop');
})->name('shop');

// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {

    // Temporary generic dashboard (will redirect based on role)
   Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->hasRole('Owner')) return redirect()->route('owner.dashboard');
    if ($user->hasRole('Admin')) return redirect()->route('admin.dashboard');  // <-- ADD THIS
    if ($user->hasRole('Manager')) return redirect()->route('manager.dashboard');
    if ($user->hasRole('Supplier')) return redirect()->route('supplier.dashboard');
    if ($user->hasRole('Skiller')) return redirect()->route('skiller.dashboard');
    if ($user->hasRole('Carpenter')) return redirect()->route('carpenter.dashboard');
    if ($user->hasRole('Delivery Driver')) return redirect()->route('driver.dashboard');
    return redirect()->route('shop'); // fallback for customer
})->name('dashboard');

    // Role-specific dashboards
    Route::get('/owner/dashboard', [OwnerDashboardController::class, 'index'])
        ->middleware('role:Owner')
        ->name('owner.dashboard');

    Route::get('/manager/dashboard', [ManagerDashboardController::class, 'index'])
        ->middleware('role:Manager')
        ->name('manager.dashboard');

    Route::get('/supplier/dashboard', [SupplierDashboardController::class, 'index'])
        ->middleware('role:Supplier')
        ->name('supplier.dashboard');



    Route::get('/skiller/dashboard', [SkillerDashboardController::class, 'index'])
        ->middleware('role:Skiller')
        ->name('skiller.dashboard');

    Route::get('/carpenter/dashboard', [CarpenterDashboardController::class, 'index'])
        ->middleware('role:Carpenter')
        ->name('carpenter.dashboard');

    Route::get('/driver/dashboard', [DriverDashboardController::class, 'index'])
        ->middleware('role:Delivery Driver')
        ->name('driver.dashboard');

    // Profile routes
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'role:Manager'])->prefix('manager')->name('manager.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [ManagerDashboardController::class, 'index'])->name('dashboard');

    // Raw Materials
    Route::resource('raw-materials', RawMaterialController::class);
    Route::post('raw-materials/{rawMaterial}/low-stock', [RawMaterialController::class, 'toggleLowStockAlert'])->name('raw-materials.low-stock');

    // Purchase Orders
    Route::resource('purchase-orders', PurchaseOrderController::class);
    Route::post('purchase-orders/{purchaseOrder}/confirm', [PurchaseOrderController::class, 'confirmDelivery'])->name('purchase-orders.confirm');


    // Products (read‑only for now)
    Route::get('products', [ProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
    Route::post('products', [ProductController::class, 'store'])->name('products.store');

    // Work Orders (production)
    Route::resource('work-orders', WorkOrderController::class);
    Route::post('work-orders/{workOrder}/status', [WorkOrderController::class, 'updateStatus'])->name('work-orders.status');
    Route::post('work-orders/{workOrder}/assign-carpenter', [WorkOrderController::class, 'assignCarpenter'])->name('work-orders.assign');



    // Material Request review
    Route::get('material-requests', [ManagerMaterialRequestController::class, 'index'])->name('material-requests.index');
    Route::get('material-requests/{materialRequest}', [ManagerMaterialRequestController::class, 'show'])->name('material-requests.show');
    Route::post('material-requests/{materialRequest}/approve', [ManagerMaterialRequestController::class, 'approve'])->name('material-requests.approve');
    Route::post('material-requests/{materialRequest}/reject', [ManagerMaterialRequestController::class, 'reject'])->name('material-requests.reject');
    Route::get('material-requests/{materialRequest}/preview', [ManagerMaterialRequestController::class, 'preview'])
        ->name('material-requests.preview');
    Route::post('material-requests/{materialRequest}/confirm-purchase-order', [ManagerMaterialRequestController::class, 'confirmPurchaseOrder'])
        ->name('material-requests.confirm-purchase-order');
    Route::get('get-supplier-materials', [ManagerMaterialRequestController::class, 'getSupplierMaterials'])
        ->name('material-requests.get-supplier-materials');

    // PDF Generation
    Route::get('purchase-orders/{purchaseOrder}/pdf', [PDFController::class, 'download'])
    ->name('purchase-orders.pdf');
});


Route::middleware(['auth', 'role:Admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    // User management
    Route::resource('users', UserController::class);
    // Material Requests
    Route::resource('material-requests', MaterialRequestController::class)->except(['edit', 'update']);
    Route::get('material-requests/{materialRequest}', [MaterialRequestController::class, 'show'])->name('material-requests.show');
    Route::resource('suppliers', AdminSupplierController::class);
    Route::get('get-supplier-materials', [MaterialRequestController::class, 'getSupplierMaterials'])
    ->name('material-requests.get-supplier-materials');
    Route::post('material-requests/{materialRequest}/mark-delivered', [MaterialRequestController::class, 'markAsDelivered'])
    ->name('material-requests.mark-delivered');

    Route::resource('raw-materials', AdminRawMaterialController::class)->only(['index', 'show']);
});


Route::middleware(['auth', 'role:Supplier'])->prefix('supplier')->name('supplier.')->group(function () {
    Route::get('/dashboard', [SupplierDashboardController::class, 'index'])->name('dashboard');
    Route::resource('materials', SupplierMaterialController::class);
    Route::resource('purchase-orders', SupplierPurchaseOrderController::class)->only(['index', 'show']);
    Route::post('purchase-orders/{purchaseOrder}/status', [SupplierPurchaseOrderController::class, 'updateStatus'])
        ->name('purchase-orders.update-status');
});



require __DIR__.'/auth.php';
