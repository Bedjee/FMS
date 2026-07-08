<?php
// database/migrations/2025_01_01_000004_create_purchase_order_items_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('purchase_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('purchase_order_id')->constrained()->cascadeOnDelete();
            $table->enum('wood_type', ['Mahogany', 'Gemelina']);
            $table->integer('thickness');
            $table->integer('width');
            $table->integer('length');
            $table->integer('quantity');
            $table->decimal('unit_price', 10, 2);
            $table->decimal('total_board_feet', 10, 2);
            $table->decimal('line_total', 12, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('purchase_order_items');
    }
};
