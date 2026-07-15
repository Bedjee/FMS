<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Material;
use App\Models\MaterialInventory;
use App\Models\Supplier;

class MaterialInventorySeeder extends Seeder
{
    public function run()
    {
        // Ensure supplier with ID 6 exists (or create it)
        $supplier = Supplier::firstOrCreate(
            ['id' => 6],
            [
                'name' => 'Default Supplier',
                'contact_person' => 'Default Contact',
                'email' => 'default@supplier.com',
                'phone' => '09123456789',
                'address' => 'Default Address',
                'category' => 'Wood',
            ]
        );

        // Define the materials and their initial stock
        $materials = [
            ['name' => 'Mahogany', 'unit' => 'BF', 'stock' => 500],
            ['name' => 'Gemelina', 'unit' => 'BF', 'stock' => 300],
            ['name' => 'Varnish', 'unit' => 'Liters', 'stock' => 100],
            ['name' => 'Common Nails', 'unit' => 'kg', 'stock' => 50],
            ['name' => 'Wood Glue', 'unit' => 'kg', 'stock' => 30],
        ];

        foreach ($materials as $materialData) {
            // Create or get the material with supplier_id
            $material = Material::firstOrCreate(
                [
                    'name' => $materialData['name'],
                    'supplier_id' => $supplier->id,
                ],
                [
                    'unit' => $materialData['unit'],
                    'is_available' => true,
                ]
            );

            // Create or update the inventory record
            MaterialInventory::updateOrCreate(
                ['material_id' => $material->id],
                [
                    'quantity' => $materialData['stock'],
                    'unit' => $materialData['unit'],
                ]
            );
        }

        $this->command->info('Material inventory seeded successfully.');
    }
}
