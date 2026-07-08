<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('material_request_items', function (Blueprint $table) {
            $table->foreignId('material_id')->nullable()->after('material_request_id')->constrained('materials')->nullOnDelete();
        });
    }

    public function down()
    {
        Schema::table('material_request_items', function (Blueprint $table) {
            $table->dropForeign(['material_id']);
            $table->dropColumn('material_id');
        });
    }
};
