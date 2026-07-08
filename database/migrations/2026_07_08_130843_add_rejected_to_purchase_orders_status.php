<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE purchase_orders MODIFY status ENUM('draft', 'sent', 'confirmed', 'rejected', 'delivered', 'cancelled') DEFAULT 'draft'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE purchase_orders MODIFY status ENUM('draft', 'sent', 'confirmed', 'delivered', 'cancelled') DEFAULT 'draft'");
    }
};
