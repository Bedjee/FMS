<?php
// database/migrations/2025_01_01_000011_create_custom_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('custom_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('customer_name');
            $table->string('customer_phone')->nullable();
            $table->text('customer_address')->nullable();
            $table->string('furniture_type');
            $table->enum('wood_type', ['Mahogany', 'Gemelina']);
            $table->decimal('length', 8, 2);
            $table->decimal('width', 8, 2);
            $table->decimal('height', 8, 2)->nullable();
            $table->text('special_requests')->nullable();
            $table->decimal('suggested_price', 12, 2);
            $table->decimal('final_price', 12, 2);
            $table->decimal('downpayment', 12, 2);
            $table->decimal('balance', 12, 2);
            $table->enum('payment_status', ['pending', 'partial', 'paid'])->default('pending');
            $table->enum('production_status', ['not_started', 'in_progress', 'completed'])->default('not_started');
            $table->foreignId('manager_id')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('custom_orders');
    }
};
