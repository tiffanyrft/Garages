<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Paiement extends Model
{
    use HasFactory;

    protected $table = 'paiement';
    protected $primaryKey = 'id_paiement';
    public $timestamps = false;

    protected $fillable = [
        'montant',
        'date_paiement',
        'statut',
        'id_voiture'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_paiement' => 'datetime'
    ];

    // Relations
    public function voiture()
    {
        return $this->belongsTo(Voiture::class, 'id_voiture');
    }

    // Accesseurs
    public function getStatutTexteAttribute()
    {
        return match($this->statut) {
            'en_attente' => 'En attente de paiement',
            'paye' => 'Payé',
            default => 'Inconnu'
        };
    }

    public function getMontantFormatteAttribute()
    {
        return number_format($this->montant, 2) . '€';
    }

    // Méthodes
    public function traiterPaiement()
    {
        $this->statut = 'paye';
        $this->date_paiement = now();
        $this->save();

        // Mettre à jour le statut de la voiture
        $voiture = $this->voiture;
        $voiture->statut = 'payee';
        $voiture->save();
    }

    public function estEnAttente()
    {
        return $this->statut === 'en_attente';
    }

    public function estPaye()
    {
        return $this->statut === 'paye';
    }
}
