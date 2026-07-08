<?php
// database/migrations/2025_01_01_000012_create_finished_inventory_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('finished_inventory', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_variant_id')->constrained();
            $table->integer('quantity');
            $table->integer('reserved_quantity')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('finished_inventory');
    }
};
