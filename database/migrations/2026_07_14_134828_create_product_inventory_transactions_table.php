<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('product_inventory_transactions', function (Blueprint $table) {
    $table->id();
    $table->foreignId('product_variant_id')->constrained('product_variants')->onDelete('cascade');
    $table->enum('type', ['stock_in', 'stock_out', 'adjustment']);
    $table->integer('quantity');
    $table->integer('balance_after');
    $table->string('reference_type')->nullable();
    $table->unsignedBigInteger('reference_id')->nullable();
    $table->text('notes')->nullable();
    $table->timestamps();
});
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_inventory_transactions');
    }
};
