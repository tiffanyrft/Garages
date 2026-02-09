<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Client extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'client';
    protected $primaryKey = 'id_client';
    public $timestamps = false;

    protected $fillable = [
        'nom',
        'prenom', 
        'telephone',
        'email',
        'mot_de_passe'
    ];

    protected $hidden = [
        'mot_de_passe'
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relations
    public function voitures()
    {
        return $this->hasMany(Voiture::class, 'id_client');
    }

    // Accesseurs
    public function getFullNameAttribute()
    {
        return "{$this->nom} {$this->prenom}";
    }

    // Mutators
    public function setMotDePasseAttribute($value)
    {
        $this->attributes['mot_de_passe'] = bcrypt($value);
    }

    public function checkPassword($password)
    {
        return password_verify($password, $this->mot_de_passe);
    }
}
