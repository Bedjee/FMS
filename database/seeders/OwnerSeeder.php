<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class OwnerSeeder extends Seeder
{
    public function run()
    {
        $ownerRole = Role::firstOrCreate(['name' => 'Owner']);

        $owner = User::create([
            'name' => 'System Owner',
            'email' => 'owner@furniture.com',
            'password' => bcrypt('password'),
            'phone' => '09123456780',
            'address' => 'CEO Office, Main Headquarters',
            'employee_id' => 'OWN-001',
        ]);

        $owner->assignRole($ownerRole);

        $this->command->info('Owner account created: owner@furniture.com / password');
    }
}
