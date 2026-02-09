<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voiture;
use App\Models\Paiement;
use App\Models\Reparation;
use App\Models\Intervention;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    /**
     * Traiter le paiement d'une voiture
     */
    public function process(Request $request, $id)
    {
        try {
            $clientId = $request->user()->id_client;
            
            $voiture = Voiture::with(['reparations.intervention', 'paiement'])
                ->where('id_voiture', $id)
                ->where('id_client', $clientId)
                ->first();

            if (!$voiture) {
                return response()->json([
                    'success' => false,
                    'message' => 'Voiture non trouvée'
                ], 404);
            }

            if ($voiture->statut !== 'terminee') {
                return response()->json([
                    'success' => false,
                    'message' => 'La voiture doit être terminée avant de pouvoir payer'
                ], 400);
            }

            $paiement = $voiture->paiement;
            if (!$paiement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun paiement trouvé pour cette voiture'
                ], 404);
            }

            if ($paiement->statut === 'paye') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cette voiture a déjà été payée'
                ], 400);
            }

            DB::beginTransaction();

            // Calculer le montant total
            $montantTotal = $voiture->getPrixTotal();

            // Mettre à jour le paiement
            $paiement->montant = $montantTotal;
            $paiement->statut = 'paye';
            $paiement->date_paiement = now();
            $paiement->save();

            // Mettre à jour le statut de la voiture
            $voiture->statut = 'payee';
            $voiture->updated_at = now();
            $voiture->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Paiement traité avec succès',
                'data' => [
                    'payment_id' => $paiement->id_paiement,
                    'amount' => (float) $montantTotal,
                    'status' => 'paid',
                    'payment_date' => $paiement->date_paiement->toISOString(),
                    'car_status' => 'paid'
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement du paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher le statut de paiement d'une voiture
     */
    public function show(Request $request, $id)
    {
        try {
            $clientId = $request->user()->id_client;
            
            $voiture = Voiture::with('paiement')
                ->where('id_voiture', $id)
                ->where('id_client', $clientId)
                ->first();

            if (!$voiture) {
                return response()->json([
                    'success' => false,
                    'message' => 'Voiture non trouvée'
                ], 404);
            }

            $paiement = $voiture->paiement;

            if (!$paiement) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun paiement trouvé pour cette voiture'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'payment_id' => $paiement->id_paiement,
                    'amount' => (float) $paiement->montant,
                    'status' => $paiement->statut === 'paye' ? 'paid' : 'pending',
                    'payment_date' => $paiement->date_paiement ? $paiement->date_paiement->toISOString() : null,
                    'car_status' => $this->convertStatus($voiture->statut)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération du paiement',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Simuler l'ajout de réparations pour une voiture (pour le développement)
     */
    public function simulateRepairs(Request $request, $id)
    {
        try {
            $clientId = $request->user()->id_client;
            
            $voiture = Voiture::where('id_voiture', $id)
                ->where('id_client', $clientId)
                ->first();

            if (!$voiture) {
                return response()->json([
                    'success' => false,
                    'message' => 'Voiture non trouvée'
                ], 404);
            }

            // Interventions disponibles
            $interventions = Intervention::getInterventionsDisponibles();
            
            // Sélectionner 2-3 interventions aléatoires
            $selectedInterventions = array_rand($interventions, rand(2, 3));
            
            DB::beginTransaction();

            // Créer les réparations
            $repairs = [];
            $totalPrice = 0;
            $totalDuration = 0;

            foreach ($selectedInterventions as $interventionName) {
                $intervention = Intervention::where('nom_intervention', $interventionName)->first();
                
                if (!$intervention) {
                    // Créer l'intervention si elle n'existe pas
                    $interventionData = $interventions[$interventionName];
                    $intervention = Intervention::create([
                        'nom_intervention' => $interventionData['nom'],
                        'prix' => $interventionData['prix'],
                        'duree_seconde' => $interventionData['duree']
                    ]);
                }

                $reparation = Reparation::create([
                    'etat' => 'en_attente',
                    'date_debut' => now(),
                    'id_voiture' => $voiture->id_voiture,
                    'id_intervention' => $intervention->id_intervention
                ]);

                $repairs[] = [
                    'id' => $reparation->id_reparation,
                    'car_id' => $voiture->id_voiture,
                    'description' => $intervention->nom_intervention,
                    'price' => (float) $intervention->prix,
                    'duration' => $intervention->duree_seconde,
                    'status' => 'waiting'
                ];

                $totalPrice += $intervention->prix;
                $totalDuration += $intervention->duree_seconde;
            }

            // Mettre à jour le statut de la voiture
            $voiture->statut = 'en_reparation';
            $voiture->updated_at = now();
            $voiture->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réparations simulées avec succès',
                'data' => [
                    'car_id' => $voiture->id_voiture,
                    'status' => 'in_repair',
                    'repairs' => $repairs,
                    'total_price' => (float) $totalPrice,
                    'estimated_duration' => $totalDuration
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la simulation des réparations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function convertStatus($dbStatus)
    {
        return match($dbStatus) {
            'en_attente' => 'waiting',
            'en_reparation' => 'in_repair',
            'terminee' => 'repaired',
            'payee' => 'paid',
            default => 'waiting'
        };
    }
}
