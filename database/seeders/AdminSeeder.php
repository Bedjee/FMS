<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $role = Role::firstOrCreate(['name' => 'Admin']);

        $user = User::create([
            'name' => 'System Administrator',
            'email' => 'admin@furniture.com',
            'password' => bcrypt('password'),
            'phone' => '09123456789',
            'address' => 'IT Department',
            'employee_id' => 'ADM-001',
        ]);

        $user->assignRole($role);

        $this->command->info('Admin account created: admin@furniture.com / password');
    }
}
