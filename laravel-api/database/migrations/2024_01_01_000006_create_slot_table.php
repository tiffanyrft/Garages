<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('slot', function (Blueprint $table) {
            $table->id('id_slot');
            $table->enum('type_slot', ['reparation', 'attente']);
            $table->boolean('occupe')->default(false);
            $table->unsignedBigInteger('id_voiture')->nullable()->unique();
            
            $table->foreign('id_voiture')
                  ->references('id_voiture')
                  ->on('voiture')
                  ->onDelete('set null');
                  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('slot');
    }
};
