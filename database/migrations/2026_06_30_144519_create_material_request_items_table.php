<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('material_request_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('material_request_id')->constrained()->cascadeOnDelete();
            $table->enum('item_type', ['wood', 'varnish', 'other']);
            $table->enum('wood_type', ['Mahogany', 'Gemelina'])->nullable();
            $table->string('description')->nullable();
            $table->decimal('quantity', 10, 2);
            $table->string('unit')->default('BF'); // BF, liters, pieces, etc.
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('material_request_items');
    }
};
