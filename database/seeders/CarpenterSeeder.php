<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class CarpenterSeeder extends Seeder
{
    public function run()
    {
        $role = Role::firstOrCreate(['name' => 'Carpenter']);

        $user = User::create([
            'name' => 'Alex Carpenter',
            'email' => 'carpenter@furniture.com',
            'password' => bcrypt('password'),
            'phone' => '09123456787',
            'address' => 'Workshop Area 1',
            'employee_id' => 'CAR-001',
            'specialization' => 'Furniture Assembly',
        ]);

        $user->assignRole($role);

        $this->command->info('Carpenter account created: carpenter@furniture.com / password');
    }
}
