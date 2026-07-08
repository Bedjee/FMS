<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Supplier;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SupplierSeeder extends Seeder
{
    public function run()
    {
        $role = Role::firstOrCreate(['name' => 'Supplier']);

        // 1. Create or get Supplier
        $supplier = Supplier::firstOrCreate(
            ['email' => 'supplier@furniture.com'],
            [
                'name' => 'Wood Suppliers Inc.',
                'contact_person' => 'John Supplier',
                'email' => 'supplier@furniture.com',
                'phone' => '09123456785',
                'address' => 'Lumber District',
                'category' => 'Wood',
            ]
        );

        // 2. Find or create User, but ensure supplier_id is set
        $user = User::firstOrNew(['email' => 'supplier@furniture.com']);
        $user->fill([
            'name' => 'Wood Suppliers Inc.',
            'password' => bcrypt('password'),
            'phone' => '09123456785',
            'address' => 'Lumber District',
            'employee_id' => 'SUP-001',
            'supplier_id' => $supplier->id,
        ]);
        $user->save();

        $user->assignRole($role);

        $this->command->info('Supplier account updated/created: supplier@furniture.com / password');
    }
}
