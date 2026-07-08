<?php
// database/migrations/2025_01_01_000009_create_work_orders_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('product_id')->constrained();
            $table->foreignId('custom_order_id')->nullable()->constrained('custom_orders');
            $table->foreignId('manager_id')->constrained('users');
            $table->foreignId('assigned_carpenter_id')->nullable()->constrained('users');
            $table->foreignId('assigned_skiller_id')->nullable()->constrained('users');
            $table->enum('status', [
                'pending_skiller', 'skiller_processing', 'awaiting_carpenter',
                'fabrication', 'wood_filling', 'sanding', 'varnishing',
                'ready_for_delivery', 'completed', 'cancelled'
            ])->default('pending_skiller');
            $table->decimal('planned_bf', 8, 2);
            $table->decimal('actual_bf_used', 8, 2)->nullable();
            $table->integer('quantity')->default(1);
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('work_orders');
    }
};
