<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reparation', function (Blueprint $table) {
            $table->id('id_reparation');
            $table->enum('etat', ['en_attente', 'en_cours', 'terminee']);
            $table->timestamp('date_debut')->nullable();
            $table->timestamp('date_fin')->nullable();
            $table->unsignedBigInteger('id_voiture');
            $table->unsignedBigInteger('id_intervention');
            
            $table->foreign('id_voiture')
                  ->references('id_voiture')
                  ->on('voiture')
                  ->onDelete('cascade');
                  
            $table->foreign('id_intervention')
                  ->references('id_intervention')
                  ->on('intervention')
                  ->onDelete('restrict');
                  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reparation');
    }
};
