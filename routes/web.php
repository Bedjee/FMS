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
use App\Http\Controllers\Admin\MaterialInventoryController as AdminMaterialInventoryController;
use App\Http\Controllers\Ecommerce\ShopController;
use App\Http\Controllers\Customer\DashboardController as CustomerDashboardController;
use App\Http\Controllers\Ecommerce\CartController;
use  App\Http\Controllers\Ecommerce\CheckoutController;
use App\Http\Controllers\Admin\DeliveryZoneController
;
use App\Http\Controllers\Manager\ProductInventoryController as ManagerProductInventoryController;
use App\Http\Controllers\Manager\OrderController as ManagerOrderController;
use App\Http\Controllers\Admin\ProductInventoryController;
use App\Http\Controllers\Manager\ReportController as ManagerReportController;
use App\Http\Controllers\Customer\OrderController;
use App\Http\Controllers\Admin\OrderController as AdminOrderController;

use App\Http\Controllers\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Manager\RawMaterialController;
use App\Http\Controllers\Supplier\MaterialController as SupplierMaterialController;
use App\Http\Controllers\Supplier\PurchaseOrderController as SupplierPurchaseOrderController;
use App\Http\Controllers\Manager\PurchaseOrderController;
use App\Http\Controllers\Manager\ProductController as ManagerProductController;
use App\Http\Controllers\Admin\RawMaterialController as AdminRawMaterialController ;
use App\Http\Controllers\Driver\OrderController as DriverOrderController;
// use App\Http\Controllers\Manager\WorkOrderController;
use App\Http\Controllers\Manager\PDFController;



use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => ['user' => auth()->user()],
    ]);
})->name('home');


Route::get('/shop', [ShopController::class, 'index'])->name('shop');
Route::get('/shop/{product}', [ShopController::class, 'show'])->name('shop.product');




// Authenticated routes
Route::middleware(['auth', 'verified'])->group(function () {

    // Temporary generic dashboard (will redirect based on role)
  Route::get('/dashboard', function () {
    $user = auth()->user();
    if ($user->hasRole('Owner')) return redirect()->route('owner.dashboard');
    if ($user->hasRole('Admin')) return redirect()->route('admin.dashboard');
    if ($user->hasRole('Manager')) return redirect()->route('manager.dashboard');
    if ($user->hasRole('Supplier')) return redirect()->route('supplier.dashboard');
    if ($user->hasRole('Skiller')) return redirect()->route('skiller.dashboard');
    if ($user->hasRole('Carpenter')) return redirect()->route('carpenter.dashboard');
    if ($user->hasRole('Delivery Driver')) return redirect()->route('driver.dashboard');
    // For customers
    return redirect()->route('customer.dashboard');
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
    Route::get('products', [ManagerProductController::class, 'index'])->name('products.index');
    Route::get('products/create', [ManagerProductController::class, 'create'])->name('products.create');
    Route::post('products', [ManagerProductController::class, 'store'])->name('products.store');

    // // Work Orders (production)
    // Route::resource('work-orders', WorkOrderController::class);
    // Route::post('work-orders/{workOrder}/status', [WorkOrderController::class, 'updateStatus'])->name('work-orders.status');
    // Route::post('work-orders/{workOrder}/assign-carpenter', [WorkOrderController::class, 'assignCarpenter'])->name('work-orders.assign');



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


        Route::get('products', [ManagerProductController::class, 'index'])->name('products.index');
    Route::get('products/{product}', [ManagerProductController::class, 'show'])->name('products.show');

    // PDF Generation
    Route::get('purchase-orders/{purchaseOrder}/pdf', [PDFController::class, 'download'])
    ->name('purchase-orders.pdf');

    Route::get('orders', [ManagerOrderController::class, 'index'])->name('orders.index');
Route::get('orders/{order}', [ManagerOrderController::class, 'show'])->name('orders.show');


Route::get('/inventory', [ManagerProductInventoryController::class, 'index'])->name('inventory.index');
Route::get('/inventory/transactions/{variant}', [ManagerProductInventoryController::class, 'transactions'])->name('inventory.transactions');

Route::get('/report', [ManagerReportController::class, 'index'])->name('report.index');       // show form
Route::get('/report/generate', [ManagerReportController::class, 'generate'])->name('report.generate'); // download PDF
});


Route::middleware(['auth', 'role:Admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    // User management
    Route::get('users/drivers', [UserController::class, 'getDrivers'])->name('users.drivers');
    Route::resource('users', UserController::class);
    Route::post('orders/{order}/assign-personnel', [AdminOrderController::class, 'assignPersonnel'])->name('orders.assign-personnel');

    // Material Requests
    Route::resource('material-requests', MaterialRequestController::class)->except(['edit', 'update']);
    Route::get('material-requests/{materialRequest}', [MaterialRequestController::class, 'show'])->name('material-requests.show');
    Route::resource('suppliers', AdminSupplierController::class);
    Route::get('get-supplier-materials', [MaterialRequestController::class, 'getSupplierMaterials'])
    ->name('material-requests.get-supplier-materials');
    Route::post('material-requests/{materialRequest}/mark-delivered', [MaterialRequestController::class, 'markAsDelivered'])
    ->name('material-requests.mark-delivered');

    Route::resource('raw-materials', AdminRawMaterialController::class)->only(['index', 'show']);



     // Products
    Route::resource('products', AdminProductController::class)->except(['show']);
    // Variants
    Route::post('products/{product}/variants', [AdminProductController::class, 'storeVariant'])->name('products.variants.store');
    Route::put('products/{product}/variants/{variant}', [AdminProductController::class, 'updateVariant'])->name('products.variants.update');
    Route::delete('products/{product}/variants/{variant}', [AdminProductController::class, 'destroyVariant'])->name('products.variants.destroy');
    // BOM
    Route::post('products/{product}/bom-items', [AdminProductController::class, 'storeBomItem'])->name('products.bom.store');
    Route::put('products/{product}/bom-items/{bomItem}', [AdminProductController::class, 'updateBomItem'])->name('products.bom.update');
    Route::delete('products/{product}/bom-items/{bomItem}', [AdminProductController::class, 'destroyBomItem'])->name('products.bom.destroy');

    Route::get('products/{product}', [AdminProductController::class, 'show'])->name('products.show');


    Route::resource('material-inventory', AdminMaterialInventoryController::class)->only(['index', 'show']);
    Route::post('material-inventory/{inventory}/adjust', [AdminMaterialInventoryController::class, 'adjust'])->name('material-inventory.adjust');




    Route::resource('delivery-zones', DeliveryZoneController::class)->except(['show']);



    Route::get('orders', [AdminOrderController::class, 'index'])->name('orders.index');
Route::get('orders/{order}', [AdminOrderController::class, 'show'])->name('orders.show');
Route::post('orders/{order}/accept', [AdminOrderController::class, 'accept'])->name('orders.accept');
Route::post('orders/{order}/reject', [AdminOrderController::class, 'reject'])->name('orders.reject');
Route::post('orders/{order}/update-status', [AdminOrderController::class, 'updateStatus'])->name('orders.update-status');






Route::get('inventory', [ProductInventoryController::class, 'index'])->name('inventory.index');
Route::post('inventory/stock-in', [ProductInventoryController::class, 'stockIn'])->name('inventory.stock-in');

Route::get('inventory/{variant}/transactions', [ProductInventoryController::class, 'transactions'])->name('inventory.transactions');



});


Route::middleware(['auth', 'role:Supplier'])->prefix('supplier')->name('supplier.')->group(function () {
    Route::get('/dashboard', [SupplierDashboardController::class, 'index'])->name('dashboard');
    Route::resource('materials', SupplierMaterialController::class);
    Route::resource('purchase-orders', SupplierPurchaseOrderController::class)->only(['index', 'show']);
    Route::post('purchase-orders/{purchaseOrder}/status', [SupplierPurchaseOrderController::class, 'updateStatus'])
        ->name('purchase-orders.update-status');


    Route::get('materials/{material}/transactions', [SupplierMaterialController::class, 'transactions'])->name('materials.transactions');
});



Route::middleware(['auth'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerDashboardController::class, 'index'])->name('dashboard');
   Route::get('/orders', [OrderController::class, 'index'])->name('orders');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');

    // Cart
    Route::get('/cart', [CartController::class, 'cartView'])->name('cart');
    Route::post('/cart/add', [CartController::class, 'add'])->name('cart.add');
    Route::put('/cart/update', [CartController::class, 'updateQuantity'])->name('cart.update');
    Route::delete('/cart/remove', [CartController::class, 'remove'])->name('cart.remove');
    Route::delete('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');
    Route::get('/cart/count', [CartController::class, 'count'])->name('cart.count');

    // Checkout
    Route::post('/checkout/selected', [CheckoutController::class, 'storeSelected'])->name('checkout.store-selected');
    Route::get('/checkout', [CheckoutController::class, 'index'])->name('checkout');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');
});


Route::middleware(['auth', 'role:Delivery Driver'])->prefix('driver')->name('driver.')->group(function () {
    Route::get('/dashboard', [DriverDashboardController::class, 'index'])->name('dashboard');
    Route::get('/orders', [DriverOrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [DriverOrderController::class, 'show'])->name('orders.show');
    Route::post('/orders/{order}/delivered', [DriverOrderController::class, 'markDelivered'])->name('orders.delivered');
});

require __DIR__.'/auth.php';
