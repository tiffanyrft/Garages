<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reparation extends Model
{
    use HasFactory;

    protected $table = 'reparation';
    protected $primaryKey = 'id_reparation';
    public $timestamps = false;

    protected $fillable = [
        'etat',
        'date_debut',
        'date_fin',
        'id_voiture',
        'id_intervention'
    ];

    protected $casts = [
        'date_debut' => 'datetime',
        'date_fin' => 'datetime',
        'prix' => 'decimal:2',
        'duree_seconde' => 'integer'
    ];

    // Relations
    public function voiture()
    {
        return $this->belongsTo(Voiture::class, 'id_voiture');
    }

    public function intervention()
    {
        return $this->belongsTo(Intervention::class, 'id_intervention');
    }

    // Scopes
    public function scopeByVoiture($query, $voitureId)
    {
        return $query->where('id_voiture', $voitureId);
    }

    public function scopeByEtat($query, $etat)
    {
        return $query->where('etat', $etat);
    }

    // Accesseurs
    public function getEtatTexteAttribute()
    {
        return match($this->etat) {
            'en_attente' => 'En attente',
            'en_cours' => 'En cours',
            'terminee' => 'Terminée',
            default => 'Inconnu'
        };
    }

    public function getPrixAttribute()
    {
        return $this->intervention->prix ?? 0;
    }

    public function getDureeSecondeAttribute()
    {
        return $this->intervention->duree_seconde ?? 0;
    }

    public function getDureeTexteAttribute()
    {
        return $this->intervention->duree_texte ?? '';
    }

    // Méthodes
    public function demarrer()
    {
        $this->etat = 'en_cours';
        $this->date_debut = now();
        $this->save();
    }

    public function terminer()
    {
        $this->etat = 'terminee';
        $this->date_fin = now();
        $this->save();

        // Vérifier si toutes les réparations de la voiture sont terminées
        $voiture = $this->voiture;
        $toutesTerminees = $voiture->reparations()
            ->where('etat', '!=', 'terminee')
            ->count() === 0;

        if ($toutesTerminees) {
            $voiture->statut = 'terminee';
            $voiture->save();
        }
    }

    public function estEnAttente()
    {
        return $this->etat === 'en_attente';
    }

    public function estEnCours()
    {
        return $this->etat === 'en_cours';
    }

    public function estTerminee()
    {
        return $this->etat === 'terminee';
    }
}
