<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class ManagerSeeder extends Seeder
{
    public function run()
    {
        // Ensure the Manager role exists
        $managerRole = Role::firstOrCreate(['name' => 'Manager']);

        // Create a manager user
        $manager = User::create([
            'name' => 'John Manager',
            'email' => 'manager@furniture.com',
            'password' => bcrypt('password'),
            'phone' => '09123456789',
            'address' => '123 Manufacturing St., Metro Manila',
            'employee_id' => 'MGR-001',
        ]);

        // Assign the Manager role
        $manager->assignRole($managerRole);

        $this->command->info('Manager account created: manager@furniture.com / password');
    }
}
