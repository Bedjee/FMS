<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('ecommerce_orders', function (Blueprint $table) {
            $table->string('recipient_name')->nullable()->after('shipping_address');
            $table->string('contact_number')->nullable()->after('recipient_name');
            $table->string('province')->nullable()->after('contact_number');
            $table->string('city')->nullable()->after('province');
            $table->string('barangay')->nullable()->after('city');
            $table->string('street_address')->nullable()->after('barangay');
            $table->string('postal_code')->nullable()->after('street_address');
        });
    }

    public function down()
    {
        Schema::table('ecommerce_orders', function (Blueprint $table) {
            $table->dropColumn([
                'recipient_name', 'contact_number', 'province', 'city',
                'barangay', 'street_address', 'postal_code'
            ]);
        });
    }
};
