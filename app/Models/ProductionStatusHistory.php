<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductionStatusHistory extends Model
{
    protected $fillable = ['work_order_id', 'status', 'user_id', 'remarks'];

    public function workOrder()
    {
        return $this->belongsTo(WorkOrder::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
