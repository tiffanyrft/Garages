<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Intervention extends Model
{
    use HasFactory;

    protected $table = 'intervention';
    protected $primaryKey = 'id_intervention';
    public $timestamps = false;

    protected $fillable = [
        'nom_intervention',
        'prix',
        'duree_seconde'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'duree_seconde' => 'integer'
    ];

    // Relations
    public function reparations()
    {
        return $this->hasMany(Reparation::class, 'id_intervention');
    }

    // Accesseurs
    public function getPrixFormatteAttribute()
    {
        return number_format($this->prix, 2) . '€';
    }

    public function getDureeHeureAttribute()
    {
        return round($this->duree_seconde / 3600, 2);
    }

    public function getDureeTexteAttribute()
    {
        $heures = floor($this->duree_seconde / 3600);
        $minutes = floor(($this->duree_seconde % 3600) / 60);
        
        if ($heures > 0 && $minutes > 0) {
            return "{$heures}h {$minutes}min";
        } elseif ($heures > 0) {
            return "{$heures}h";
        } else {
            return "{$minutes}min";
        }
    }

    // Scope pour les types d'interventions fixes
    public static function getInterventionsDisponibles()
    {
        return [
            'Frein' => ['nom' => 'Frein', 'prix' => 120.00, 'duree' => 3600],
            'Vidange' => ['nom' => 'Vidange', 'prix' => 60.00, 'duree' => 1800],
            'Filtre' => ['nom' => 'Filtre', 'prix' => 25.00, 'duree' => 900],
            'Batterie' => ['nom' => 'Batterie', 'prix' => 150.00, 'duree' => 2700],
            'Amortisseurs' => ['nom' => 'Amortisseurs', 'prix' => 200.00, 'duree' => 5400],
            'Embrayage' => ['nom' => 'Embrayage', 'prix' => 350.00, 'duree' => 7200],
            'Pneus' => ['nom' => 'Pneus', 'prix' => 320.00, 'duree' => 3600],
            'Système de refroidissement' => ['nom' => 'Système de refroidissement', 'prix' => 180.00, 'duree' => 4500],
        ];
    }
}
