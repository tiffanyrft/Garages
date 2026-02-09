<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Slot extends Model
{
    use HasFactory;

    protected $table = 'slot';
    protected $primaryKey = 'id_slot';
    public $timestamps = false;

    protected $fillable = [
        'type_slot',
        'occupe',
        'id_voiture'
    ];

    protected $casts = [
        'occupe' => 'boolean'
    ];

    // Relations
    public function voiture()
    {
        return $this->belongsTo(Voiture::class, 'id_voiture');
    }

    // Scopes
    public function scopeReparation($query)
    {
        return $query->where('type_slot', 'reparation');
    }

    public function scopeAttente($query)
    {
        return $query->where('type_slot', 'attente');
    }

    public function scopeLibres($query)
    {
        return $query->where('occupe', false);
    }

    public function scopeOccupes($query)
    {
        return $query->where('occupe', true);
    }

    // Méthodes
    public function estLibre()
    {
        return !$this->occupe;
    }

    public function estOccupe()
    {
        return $this->occupe;
    }

    public function occuper(Voiture $voiture)
    {
        $this->id_voiture = $voiture->id_voiture;
        $this->occupe = true;
        $this->save();
    }

    public function liberer()
    {
        $this->id_voiture = null;
        $this->occupe = false;
        $this->save();
    }

    // Méthodes statiques
    public static function getSlotsReparationLibres()
    {
        return self::reparation()->libres()->get();
    }

    public static function getSlotsReparationOccupes()
    {
        return self::reparation()->occupes()->with('voiture.client')->get();
    }

    public static function getSlotAttente()
    {
        return self::attente()->first();
    }

    public static function peutPlacerVoitureEnReparation()
    {
        return self::reparation()->libres()->count() > 0;
    }

    public static function getSlotReparationDisponible()
    {
        return self::reparation()->libres()->first();
    }
}
