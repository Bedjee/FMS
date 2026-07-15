<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('bom_items', function (Blueprint $table) {
            $table->text('notes')->nullable()->after('unit');
        });
    }

    public function down()
    {
        Schema::table('bom_items', function (Blueprint $table) {
            $table->dropColumn('notes');
        });
    }
};
