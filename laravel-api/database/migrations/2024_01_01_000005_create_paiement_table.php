<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('paiement', function (Blueprint $table) {
            $table->id('id_paiement');
            $table->decimal('montant', 10, 2);
            $table->timestamp('date_paiement');
            $table->enum('statut', ['en_attente', 'paye']);
            $table->unsignedBigInteger('id_voiture')->unique();
            
            $table->foreign('id_voiture')
                  ->references('id_voiture')
                  ->on('voiture')
                  ->onDelete('cascade');
                  
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('paiement');
    }
};
