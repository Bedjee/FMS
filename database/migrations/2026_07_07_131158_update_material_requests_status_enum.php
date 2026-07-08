<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        DB::statement("ALTER TABLE material_requests MODIFY status ENUM('pending', 'approved', 'ordered', 'rejected', 'delivered') DEFAULT 'pending'");
    }

    public function down()
    {
        DB::statement("ALTER TABLE material_requests MODIFY status ENUM('pending', 'approved', 'rejected', 'delivered') DEFAULT 'pending'");
    }
};
