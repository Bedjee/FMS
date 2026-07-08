<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class DriverSeeder extends Seeder
{
    public function run()
    {
        $role = Role::firstOrCreate(['name' => 'Delivery Driver']);

        $user = User::create([
            'name' => 'Michael Driver',
            'email' => 'driver@furniture.com',
            'password' => bcrypt('password'),
            'phone' => '09123456786',
            'address' => 'Fleet Depot',
            'employee_id' => 'DRV-001',
        ]);

        $user->assignRole($role);

        $this->command->info('Delivery Driver account created: driver@furniture.com / password');
    }
}
