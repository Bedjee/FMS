<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RolePermissionSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles using firstOrCreate to avoid duplicates
        $owner = Role::firstOrCreate(['name' => 'Owner']);
        $admin = Role::firstOrCreate(['name' => 'Admin']);
        $manager = Role::firstOrCreate(['name' => 'Manager']);
        $supplier = Role::firstOrCreate(['name' => 'Supplier']);
        $skiller = Role::firstOrCreate(['name' => 'Skiller']);
        $carpenter = Role::firstOrCreate(['name' => 'Carpenter']);
        $driver = Role::firstOrCreate(['name' => 'Delivery Driver']);
        $customer = Role::firstOrCreate(['name' => 'Customer']);

        // Optional: assign permissions if you have defined them
        // For now, just create a default manager user if not exists
        if (!User::where('email', 'manager@furniture.com')->exists()) {
            $managerUser = User::create([
                'name' => 'Manager User',
                'email' => 'manager@furniture.com',
                'password' => bcrypt('password'),
                'phone' => '09123456789',
                'address' => '123 Manufacturing St.',
                'employee_id' => 'MGR-001',
            ]);
            $managerUser->assignRole('Manager');
        }

        // Optionally create other default users if they don't exist
        // You can also call other seeders from here or run them separately

        $this->command->info('Roles and default users seeded successfully!');
    }
}
