<?php
// database/migrations/2025_01_01_000018_create_pos_transactions_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('pos_transactions', function (Blueprint $table) {
            $table->id();
            $table->string('transaction_number')->unique();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('custom_order_id')->nullable()->constrained();
            $table->string('customer_name')->nullable();
            $table->decimal('total_amount', 12, 2);
            $table->decimal('paid_amount', 12, 2);
            $table->decimal('change_amount', 12, 2)->default(0);
            $table->enum('payment_method', ['cash', 'gcash', 'card'])->default('cash');
            $table->enum('transaction_type', ['retail', 'custom_order_downpayment', 'custom_order_balance']);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('pos_transactions');
    }
};
