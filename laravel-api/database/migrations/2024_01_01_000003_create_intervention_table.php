<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('intervention', function (Blueprint $table) {
            $table->id('id_intervention');
            $table->string('nom_intervention', 100);
            $table->decimal('prix', 10, 2);
            $table->integer('duree_seconde');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('intervention');
    }
};
