<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Drop the existing ENUM constraint and convert to VARCHAR
        DB::statement('ALTER TABLE raw_materials MODIFY material_name VARCHAR(100) NULL');
    }

    public function down()
    {
        // Revert to ENUM (only if necessary, but this may break data)
        DB::statement("ALTER TABLE raw_materials MODIFY material_name ENUM('Mahogany', 'Gemelina') NULL");
    }
};
