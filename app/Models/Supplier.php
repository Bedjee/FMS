<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use SoftDeletes;

    protected $fillable = ['name', 'contact_person', 'email', 'phone', 'address','category'];


    public function materials()
    {
        return $this->hasMany(Material::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }



    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    public function rawMaterials()
    {
        return $this->hasMany(RawMaterial::class);
    }
}
