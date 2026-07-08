<?php
// database/migrations/2025_01_01_000008_create_bom_items_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('bom_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->enum('wood_type', ['Mahogany', 'Gemelina']);
            $table->decimal('board_feet_required', 8, 2);
            $table->decimal('labor_cost', 10, 2);
            $table->decimal('varnish_cost', 10, 2);
            $table->decimal('other_cost', 10, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('bom_items');
    }
};
