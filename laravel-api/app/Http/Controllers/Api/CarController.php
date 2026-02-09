<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Voiture;
use App\Models\Reparation;
use App\Models\Intervention;
use App\Models\Paiement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CarController extends Controller
{
    /**
     * Lister les voitures du client connecté
     */
    public function index(Request $request)
    {
        try {
            $clientId = $request->user()->id_client;
            
            $voitures = Voiture::with(['reparations.intervention', 'paiement'])
                ->where('id_client', $clientId)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($voiture) {
                    return [
                        'id' => $voiture->id_voiture,
                        'client_id' => $voiture->id_client,
                        'brand' => $voiture->marque,
                        'model' => $voiture->modele,
                        'license_plate' => $voiture->immatriculation,
                        'problem_description' => $voiture->problem_description ?? 'Non spécifié',
                        'status' => $this->convertStatus($voiture->statut),
                        'repairs' => $voiture->reparations->map(function ($reparation) {
                            return [
                                'id' => $reparation->id_reparation,
                                'car_id' => $reparation->id_voiture,
                                'description' => $reparation->intervention->nom_intervention,
                                'price' => (float) $reparation->prix,
                                'duration' => $reparation->duree_seconde,
                                'status' => $this->convertRepairStatus($reparation->etat)
                            ];
                        }),
                        'total_price' => (float) $voiture->getPrixTotal(),
                        'estimated_duration' => $voiture->getDureeTotale(),
                        'created_at' => $voiture->created_at ?? now()->toISOString(),
                        'updated_at' => $voiture->updated_at ?? now()->toISOString()
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $voitures
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des voitures',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Ajouter une nouvelle voiture
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'brand' => 'required|string|max:100',
            'model' => 'required|string|max:100',
            'license_plate' => 'required|string|max:50|unique:voiture,immatriculation',
            'problem_description' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            DB::beginTransaction();

            $clientId = $request->user()->id_client;

            $voiture = Voiture::create([
                'marque' => $request->brand,
                'modele' => $request->model,
                'immatriculation' => strtoupper($request->license_plate),
                'statut' => 'en_attente',
                'id_client' => $clientId,
                'created_at' => now(),
                'updated_at' => now()
            ]);

            // Ajouter le champ problem_description s'il n'existe pas dans la table
            if (!isset($voiture->problem_description)) {
                // Pour l'instant, on le stocke dans une table séparée ou on l'ajoute en commentaire
                DB::statement("COMMENT ON COLUMN voiture.id_voiture IS 'Problem: {$request->problem_description}'");
            }

            // Créer le paiement en attente
            Paiement::create([
                'montant' => 0,
                'date_paiement' => now(),
                'statut' => 'en_attente',
                'id_voiture' => $voiture->id_voiture
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Voiture ajoutée avec succès',
                'data' => [
                    'id' => $voiture->id_voiture,
                    'client_id' => $voiture->id_client,
                    'brand' => $voiture->marque,
                    'model' => $voiture->modele,
                    'license_plate' => $voiture->immatriculation,
                    'problem_description' => $request->problem_description,
                    'status' => 'waiting',
                    'repairs' => [],
                    'total_price' => 0,
                    'estimated_duration' => 0,
                    'created_at' => $voiture->created_at->toISOString(),
                    'updated_at' => $voiture->updated_at->toISOString()
                ]
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'ajout de la voiture',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher les détails d'une voiture
     */
    public function show(Request $request, $id)
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

            $carData = [
                'id' => $voiture->id_voiture,
                'client_id' => $voiture->id_client,
                'brand' => $voiture->marque,
                'model' => $voiture->modele,
                'license_plate' => $voiture->immatriculation,
                'problem_description' => $voiture->problem_description ?? 'Non spécifié',
                'status' => $this->convertStatus($voiture->statut),
                'repairs' => $voiture->reparations->map(function ($reparation) {
                    return [
                        'id' => $reparation->id_reparation,
                        'car_id' => $reparation->id_voiture,
                        'description' => $reparation->intervention->nom_intervention,
                        'price' => (float) $reparation->prix,
                        'duration' => $reparation->duree_seconde,
                        'status' => $this->convertRepairStatus($reparation->etat)
                    ];
                }),
                'total_price' => (float) $voiture->getPrixTotal(),
                'estimated_duration' => $voiture->getDureeTotale(),
                'created_at' => $voiture->created_at ?? now()->toISOString(),
                'updated_at' => $voiture->updated_at ?? now()->toISOString()
            ];

            return response()->json([
                'success' => true,
                'data' => $carData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des détails',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mettre à jour le statut d'une voiture
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'status' => 'required|in:waiting,in_repair,repaired,paid'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

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

            $oldStatus = $voiture->statut;
            $newStatus = $this->convertToDbStatus($request->status);

            $voiture->statut = $newStatus;
            $voiture->updated_at = now();
            $voiture->save();

            return response()->json([
                'success' => true,
                'message' => 'Statut mis à jour avec succès',
                'data' => [
                    'id' => $voiture->id_voiture,
                    'status' => $request->status,
                    'old_status' => $this->convertStatus($oldStatus)
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du statut',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Méthodes utilitaires
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

    private function convertToDbStatus($apiStatus)
    {
        return match($apiStatus) {
            'waiting' => 'en_attente',
            'in_repair' => 'en_reparation',
            'repaired' => 'terminee',
            'paid' => 'payee',
            default => 'en_attente'
        };
    }

    private function convertRepairStatus($dbStatus)
    {
        return match($dbStatus) {
            'en_attente' => 'waiting',
            'en_cours' => 'in_progress',
            'terminee' => 'completed',
            default => 'waiting'
        };
    }
}
