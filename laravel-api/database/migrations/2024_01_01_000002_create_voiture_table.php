<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('voiture', function (Blueprint $table) {
            $table->id('id_voiture');
            $table->string('marque', 100);
            $table->string('modele', 100);
            $table->string('immatriculation', 50)->unique();
            $table->enum('statut', ['en_attente', 'en_reparation', 'terminee']);
            $table->unsignedBigInteger('id_client');
            
            $table->foreign('id_client')
                  ->references('id_client')
                  ->on('client')
                  ->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('voiture');
    }
};
