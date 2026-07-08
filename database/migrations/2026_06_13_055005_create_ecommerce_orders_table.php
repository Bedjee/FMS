<?php
// database/migrations/2025_01_01_000013_create_ecommerce_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('ecommerce_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained();
            $table->decimal('subtotal', 12, 2);
            $table->decimal('shipping_fee', 10, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->decimal('downpayment_paid', 12, 2);
            $table->decimal('cod_balance', 12, 2);
            $table->enum('payment_status', ['awaiting_downpayment', 'downpayment_paid', 'completed']);
            $table->enum('fulfillment_status', ['pending', 'processing', 'shipped', 'delivered', 'cancelled']);
            $table->text('shipping_address');
            $table->string('tracking_code')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('ecommerce_orders');
    }
};
