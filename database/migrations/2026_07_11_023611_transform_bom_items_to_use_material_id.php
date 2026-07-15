<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bom_items', function (Blueprint $table) {
            // Add new columns first (nullable)
            $table->foreignId('material_id')->nullable()->constrained('materials')->nullOnDelete();
            $table->decimal('quantity', 10, 2)->nullable()->after('product_id');
            $table->string('unit')->nullable()->after('quantity');
        });

        // Data migration: link existing BOM items to materials (if any)
        // If you have existing records, this will map wood_type to material_id
        // You can skip if no data exists
        $existing = DB::table('bom_items')->whereNotNull('wood_type')->get();
        foreach ($existing as $item) {
            // Find material by name (wood_type) or fallback to first wood material
            $material = \App\Models\Material::where('name', 'LIKE', '%' . $item->wood_type . '%')
                ->whereHas('supplier', function ($q) {
                    $q->where('category', 'Wood');
                })->first();

            if ($material) {
                DB::table('bom_items')
                    ->where('id', $item->id)
                    ->update([
                        'material_id' => $material->id,
                        'quantity' => $item->board_feet_required,
                        'unit' => 'BF',
                    ]);
            }
        }

        // Now drop old columns
        Schema::table('bom_items', function (Blueprint $table) {
            $table->dropColumn(['wood_type', 'board_feet_required', 'labor_cost', 'varnish_cost', 'other_cost']);
        });
    }

    public function down()
    {
        Schema::table('bom_items', function (Blueprint $table) {
            // Drop foreign key first
            $table->dropForeign(['material_id']);
            // Drop new columns
            $table->dropColumn(['material_id', 'quantity', 'unit']);
            // Add back old columns
            $table->enum('wood_type', ['Mahogany', 'Gemelina'])->nullable();
            $table->decimal('board_feet_required', 8, 2)->nullable();
            $table->decimal('labor_cost', 10, 2)->nullable();
            $table->decimal('varnish_cost', 10, 2)->nullable();
            $table->decimal('other_cost', 10, 2)->nullable();
        });
    }
};
