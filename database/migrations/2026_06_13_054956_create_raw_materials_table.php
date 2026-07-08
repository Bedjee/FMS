<?php
// database/migrations/2025_01_01_000005_create_raw_materials_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('raw_materials', function (Blueprint $table) {
            $table->id();
            $table->enum('wood_type', ['Mahogany', 'Gemelina']);
            $table->decimal('board_feet', 10, 2);
            $table->integer('thickness');
            $table->integer('width');
            $table->integer('length');
            $table->foreignId('supplier_id')->constrained();
            $table->foreignId('purchase_order_id')->nullable()->constrained();
            $table->date('delivery_date');
            $table->string('receipt_path')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('raw_materials');
    }
};
