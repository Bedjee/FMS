<?php
// database/migrations/2025_01_01_000015_create_deliveries_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('deliveries', function (Blueprint $table) {
            $table->id();
            $table->morphs('deliverable');
            $table->foreignId('driver_id')->constrained('users');
            $table->enum('status', ['assigned', 'out_for_delivery', 'delivered'])->default('assigned');
            $table->datetime('assigned_at');
            $table->datetime('out_for_delivery_at')->nullable();
            $table->datetime('delivered_at')->nullable();
            $table->text('delivery_notes')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('deliveries');
    }
};
