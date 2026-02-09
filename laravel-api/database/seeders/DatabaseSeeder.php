<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Intervention;
use App\Models\Client;
use App\Models\Voiture;
use App\Models\Reparation;
use App\Models\Paiement;
use App\Models\Slot;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->command->info('Début du seeding de la base de données...');

        // Créer les 8 types d'interventions fixes
        $this->command->info('Création des interventions...');
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
            Intervention::firstOrCreate(
                ['nom_intervention' => $intervention['nom_intervention']],
                $intervention
            );
        }

        // Créer les slots (2 slots de réparation + 1 slot d'attente)
        $this->command->info('Création des slots...');
        Slot::firstOrCreate(['id_slot' => 1], [
            'type_slot' => 'reparation',
            'occupe' => false,
        ]);

        Slot::firstOrCreate(['id_slot' => 2], [
            'type_slot' => 'reparation', 
            'occupe' => false,
        ]);

        Slot::firstOrCreate(['id_slot' => 3], [
            'type_slot' => 'attente',
            'occupe' => false,
        ]);

        // Créer un client de test
        $this->command->info('Création du client de test...');
        $client = Client::firstOrCreate(
            ['email' => 'test@test.com'],
            [
                'nom' => 'Dupont',
                'prenom' => 'Jean',
                'telephone' => '0612345678',
                'mot_de_passe' => Hash::make('password'),
            ]
        );

        // Créer des voitures de test pour le client
        $this->command->info('Création des voitures de test...');
        $voituresData = [
            [
                'marque' => 'Renault',
                'modele' => 'Clio',
                'immatriculation' => 'AB-123-CD',
                'statut' => 'en_attente',
                'problem_description' => 'Frein qui fait du bruit et changement d\'huile',
            ],
            [
                'marque' => 'Peugeot',
                'modele' => '308',
                'immatriculation' => 'EF-456-GH',
                'statut' => 'en_reparation',
                'problem_description' => 'Vidange et contrôle technique',
            ],
            [
                'marque' => 'Citroën',
                'modele' => 'C3',
                'immatriculation' => 'IJ-789-KL',
                'statut' => 'terminee',
                'problem_description' => 'Changement pneus et plaquettes de frein',
            ],
            [
                'marque' => 'Volkswagen',
                'modele' => 'Golf',
                'immatriculation' => 'MN-012-OP',
                'statut' => 'payee',
                'problem_description' => 'Réparation climatisation',
            ],
        ];

        foreach ($voituresData as $index => $voitureData) {
            $voiture = Voiture::firstOrCreate(
                ['immatriculation' => $voitureData['immatriculation']],
                array_merge($voitureData, [
                    'id_client' => $client->id_client,
                    'created_at' => now()->subDays($index + 1),
                    'updated_at' => now()->subHours($index),
                ])
            );

            // Créer des réparations pour certaines voitures
            if ($voiture->id_voiture == 2) { // Peugeot 308 - en réparation
                $reparation1 = Reparation::create([
                    'etat' => 'en_cours',
                    'date_debut' => now()->subHours(2),
                    'id_voiture' => $voiture->id_voiture,
                    'id_intervention' => Intervention::where('nom_intervention', 'Vidange')->first()->id_intervention
                ]);

                $reparation2 = Reparation::create([
                    'etat' => 'en_attente',
                    'date_debut' => now()->subHours(2),
                    'id_voiture' => $voiture->id_voiture,
                    'id_intervention' => Intervention::where('nom_intervention', 'Filtre')->first()->id_intervention
                ]);
            }

            if ($voiture->id_voiture == 3) { // Citroën C3 - terminée
                $reparations = [
                    'Pneus',
                    'Plaquettes de frein avant',
                    'Main d\'œuvre'
                ];

                foreach ($reparations as $index => $nomReparation) {
                    if ($nomReparation === 'Pneus') {
                        $intervention = Intervention::where('nom_intervention', 'Pneus')->first();
                    } elseif ($nomReparation === 'Plaquettes de frein avant') {
                        $intervention = Intervention::where('nom_intervention', 'Frein')->first();
                    } else {
                        // Créer une intervention "Main d'œuvre"
                        $intervention = Intervention::firstOrCreate(
                            ['nom_intervention' => 'Main d\'œuvre'],
                            ['prix' => 120.00, 'duree_seconde' => 12600]
                        );
                    }

                    Reparation::create([
                        'etat' => 'terminee',
                        'date_debut' => now()->subDays(2),
                        'date_fin' => now()->subDays(1),
                        'id_voiture' => $voiture->id_voiture,
                        'id_intervention' => $intervention->id_intervention
                    ]);
                }
            }

            if ($voiture->id_voiture == 4) { // Volkswagen Golf - payée
                $reparation1 = Reparation::create([
                    'etat' => 'terminee',
                    'date_debut' => now()->subDays(3),
                    'date_fin' => now()->subDays(2),
                    'id_voiture' => $voiture->id_voiture,
                    'id_intervention' => Intervention::where('nom_intervention', 'Système de refroidissement')->first()->id_intervention
                ]);

                $reparation2 = Reparation::create([
                    'etat' => 'terminee',
                    'date_debut' => now()->subDays(3),
                    'date_fin' => now()->subDays(2),
                    'id_voiture' => $voiture->id_voiture,
                    'id_intervention' => Intervention::where('nom_intervention', 'Filtre')->first()->id_intervention
                ]);

                // Créer le paiement
                Paiement::create([
                    'montant' => 135.00,
                    'date_paiement' => now()->subDays(1),
                    'statut' => 'paye',
                    'id_voiture' => $voiture->id_voiture
                ]);
            }

            // Créer un paiement en attente pour les voitures non payées
            if (!in_array($voiture->id_voiture, [4])) {
                Paiement::firstOrCreate(
                    ['id_voiture' => $voiture->id_voiture],
                    [
                        'montant' => 0,
                        'date_paiement' => now(),
                        'statut' => 'en_attente'
                    ]
                );
            }
        }

        $this->command->info('Base de données peuplée avec succès !');
        $this->command->info('Client de test : test@test.com / password');
        $this->command->info('Voitures créées : ' . count($voituresData));
    }
}
