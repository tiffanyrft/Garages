<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voiture extends Model
{
    use HasFactory;

    protected $table = 'voiture';
    protected $primaryKey = 'id_voiture';
    public $timestamps = false;

    protected $fillable = [
        'marque',
        'modele',
        'immatriculation',
        'statut',
        'id_client'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relations
    public function client()
    {
        return $this->belongsTo(Client::class, 'id_client');
    }

    public function reparations()
    {
        return $this->hasMany(Reparation::class, 'id_voiture');
    }

    public function paiement()
    {
        return $this->hasOne(Paiement::class, 'id_voiture');
    }

    // Scopes
    public function scopeByClient($query, $clientId)
    {
        return $query->where('id_client', $clientId);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('statut', $status);
    }

    // Accesseurs
    public function getStatutTexteAttribute()
    {
        return match($this->statut) {
            'en_attente' => 'En attente',
            'en_reparation' => 'En réparation',
            'terminee' => 'Terminée',
            'payee' => 'Payée',
            default => 'Inconnu'
        };
    }

    public function getCouleurStatutAttribute()
    {
        return match($this->statut) {
            'en_attente' => '#FFA500', // Orange
            'en_reparation' => '#007BFF', // Bleu
            'terminee' => '#28A745', // Vert
            'payee' => '#6C757D', // Gris
            default => '#DC3545' // Rouge
        };
    }

    // Méthodes
    public function peutEtreReparee()
    {
        return $this->statut === 'en_attente';
    }

    public function estEnReparation()
    {
        return $this->statut === 'en_reparation';
    }

    public function estTerminee()
    {
        return $this->statut === 'terminee';
    }

    public function estPayee()
    {
        return $this->statut === 'payee';
    }

    public function getPrixTotal()
    {
        return $this->reparations()->sum('prix');
    }

    public function getDureeTotale()
    {
        return $this->reparations()->sum('duree_seconde');
    }
}
