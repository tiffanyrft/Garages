<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Client;
use App\Models\Voiture;
use App\Models\Intervention;
use App\Models\Slot;
use Illuminate\Support\Facades\Hash;

class GarageSeeder extends Seeder
{
    public function run(): void
    {
        // Créer les slots (2 réparation + 1 attente)
        Slot::create(['type_slot' => 'reparation', 'occupe' => false]);
        Slot::create(['type_slot' => 'reparation', 'occupe' => false]);
        Slot::create(['type_slot' => 'attente', 'occupe' => false]);

        // Créer les interventions de base
        $interventions = [
            ['nom_intervention' => 'Frein', 'prix' => 120.00, 'duree_seconde' => 3600],
            ['nom_intervention' => 'Vidange', 'prix' => 60.00, 'duree_seconde' => 1800],
            ['nom_intervention' => 'Filtre', 'prix' => 25.00, 'duree_seconde' => 900],
            ['nom_intervention' => 'Batterie', 'prix' => 150.00, 'duree_seconde' => 2700],
            ['nom_intervention' => 'Amortisseurs', 'prix' => 200.00, 'duree_seconde' => 5400],
            ['nom_intervention' => 'Embrayage', 'prix' => 350.00, 'duree_seconde' => 7200],
            ['nom_intervention' => 'Pneus', 'prix' => 320.00, 'duree_seconde' => 3600],
            ['nom_intervention' => 'Système de refroidissement', 'prix' => 180.00, 'duree_seconde' => 4500],
        ];

        foreach ($interventions as $intervention) {
            Intervention::create($intervention);
        }

        // Créer des clients de test
        $clients = [
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'telephone' => '0612345678',
                'email' => 'jean.dupont@email.com',
                'mot_de_passe' => Hash::make('password123')
            ],
            [
                'nom' => 'Martin',
                'prenom' => 'Marie',
                'telephone' => '0623456789',
                'email' => 'marie.martin@email.com',
                'mot_de_passe' => Hash::make('password123')
            ],
            [
                'nom' => 'Bernard',
                'prenom' => 'Pierre',
                'telephone' => '0634567890',
                'email' => 'pierre.bernard@email.com',
                'mot_de_passe' => Hash::make('password123')
            ],
            [
                'nom' => 'Petit',
                'prenom' => 'Sophie',
                'telephone' => '0645678901',
                'email' => 'sophie.petit@email.com',
                'mot_de_passe' => Hash::make('password123')
            ],
            [
                'nom' => 'Robert',
                'prenom' => 'Michel',
                'telephone' => '0656789012',
                'email' => 'michel.robert@email.com',
                'mot_de_passe' => Hash::make('password123')
            ]
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }

        // Créer des voitures pour les clients
        $voitures = [
            ['marque' => 'Renault', 'modele' => 'Clio', 'immatriculation' => 'AB-123-CD', 'id_client' => 1, 'statut' => 'en_attente'],
            ['marque' => 'Peugeot', 'modele' => '208', 'immatriculation' => 'EF-456-GH', 'id_client' => 1, 'statut' => 'en_reparation'],
            ['marque' => 'Citroën', 'modele' => 'C3', 'immatriculation' => 'IJ-789-KL', 'id_client' => 2, 'statut' => 'terminee'],
            ['marque' => 'Volkswagen', 'modele' => 'Golf', 'immatriculation' => 'MN-012-OP', 'id_client' => 3, 'statut' => 'en_attente'],
            ['marque' => 'Toyota', 'modele' => 'Yaris', 'immatriculation' => 'QR-345-ST', 'id_client' => 4, 'statut' => 'en_reparation'],
            ['marque' => 'Ford', 'modele' => 'Fiesta', 'immatriculation' => 'UV-678-WX', 'id_client' => 5, 'statut' => 'en_attente'],
            ['marque' => 'BMW', 'modele' => 'Série 1', 'immatriculation' => 'YZ-901-AB', 'id_client' => 2, 'statut' => 'terminee'],
            ['marque' => 'Mercedes', 'modele' => 'Classe A', 'immatriculation' => 'CD-234-EF', 'id_client' => 3, 'statut' => 'en_attente']
        ];

        foreach ($voitures as $voiture) {
            Voiture::create($voiture);
        }
    }
}
