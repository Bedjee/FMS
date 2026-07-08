<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class SkillerSeeder extends Seeder
{
    public function run()
    {
        // Ensure the Skiller role exists (created already in RolePermissionSeeder)
        $skillerRole = Role::firstOrCreate(['name' => 'Skiller']);

        // Create a skiller user
        $skiller = User::create([
            'name' => 'John Skiller',
            'email' => 'skiller@furniture.com',
            'password' => bcrypt('password'),
            'phone' => '09123456788',
            'address' => '456 Production St., Metro Manila',
            'employee_id' => 'SKL-001',
            'specialization' => 'Wood Processing',
        ]);

        // Assign the Skiller role
        $skiller->assignRole($skillerRole);

        $this->command->info('Skiller account created: skiller@furniture.com / password');
    }
}
