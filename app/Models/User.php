<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, HasRoles, Notifiable;

    protected $fillable = [
        'name', 'email', 'password', 'phone', 'address', 'employee_id', 'specialization', 'role_id','supplier_id','available_capital'
    ];

    protected $hidden = ['password', 'remember_token'];

    public function workOrdersManaged()
    {
        return $this->hasMany(WorkOrder::class, 'manager_id');
    }

    public function assignedWorkOrders()
    {
        return $this->hasMany(WorkOrder::class, 'assigned_carpenter_id');
    }

    public function skillerWorkOrders()
    {
        return $this->hasMany(WorkOrder::class, 'assigned_skiller_id');
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class, 'driver_id');
    }

    public function purchaseOrdersCreated()
    {
        return $this->hasMany(PurchaseOrder::class, 'created_by');
    }

    public function posTransactions()
    {
        return $this->hasMany(POSTransaction::class);
    }

    public function notifications()
    {
        return $this->hasMany(AppNotification::class);
    }

    public function supplier()
{
    return $this->belongsTo(Supplier::class);
}

public function deductCapital($amount)
{
    if ($this->available_capital < $amount) {
        throw new \Exception('Insufficient capital.');
    }
    $this->available_capital -= $amount;
    $this->save();
}
}
