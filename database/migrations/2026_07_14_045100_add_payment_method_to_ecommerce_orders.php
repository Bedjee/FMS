<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ecommerce_orders', function (Blueprint $table) {
            $table->enum('payment_method', ['cod', 'gcash'])->default('cod')->after('payment_status');
        });
    }

    public function down()
    {
        Schema::table('ecommerce_orders', function (Blueprint $table) {
            $table->dropColumn('payment_method');
        });
    }
};
