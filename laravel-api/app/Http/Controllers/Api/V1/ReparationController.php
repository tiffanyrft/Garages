<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reparation;
use App\Models\Voiture;
use App\Models\Intervention;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class ReparationController extends Controller
{
    public function index(): JsonResponse
    {
        $reparations = Reparation::with('voiture.client', 'intervention')->get();
        return response()->json([
            'success' => true,
            'data' => $reparations
        ]);
    }

    public function show($id): JsonResponse
    {
        $reparation = Reparation::with('voiture.client', 'intervention')->find($id);
        
        if (!$reparation) {
            return response()->json([
                'success' => false,
                'message' => 'Réparation non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $reparation
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'id_voiture' => 'required|exists:voiture,id_voiture',
            'id_intervention' => 'required|exists:intervention,id_intervention'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $voiture = Voiture::find($request->id_voiture);
        
        // Vérifier si la voiture peut avoir une nouvelle réparation
        if ($voiture->statut === 'terminee' || $voiture->statut === 'payee') {
            return response()->json([
                'success' => false,
                'message' => 'Cette voiture est terminée et ne peut plus recevoir de réparations'
            ], 400);
        }

        // Vérifier les règles métier des slots
        if (!Slot::peutPlacerVoitureEnReparation()) {
            return response()->json([
                'success' => false,
                'message' => 'Aucun slot de réparation disponible (maximum 2 voitures en réparation)'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $reparation = Reparation::create([
                'etat' => 'en_attente',
                'id_voiture' => $request->id_voiture,
                'id_intervention' => $request->id_intervention
            ]);

            // Mettre à jour le statut de la voiture
            if ($voiture->statut === 'en_attente') {
                $voiture->statut = 'en_reparation';
                $voiture->save();

                // Placer la voiture dans un slot de réparation
                $slotDisponible = Slot::getSlotReparationDisponible();
                if ($slotDisponible) {
                    $slotDisponible->occuper($voiture);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réparation créée avec succès',
                'data' => $reparation->load('voiture.client', 'intervention')
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création de la réparation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function demarrer($id): JsonResponse
    {
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'success' => false,
                'message' => 'Réparation non trouvée'
            ], 404);
        }

        if (!$reparation->estEnAttente()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette réparation ne peut pas être démarrée'
            ], 400);
        }

        $reparation->demarrer();

        return response()->json([
            'success' => true,
            'message' => 'Réparation démarrée avec succès',
            'data' => $reparation->load('voiture.client', 'intervention')
        ]);
    }

    public function terminer($id): JsonResponse
    {
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'success' => false,
                'message' => 'Réparation non trouvée'
            ], 404);
        }

        if (!$reparation->estEnCours()) {
            return response()->json([
                'success' => false,
                'message' => 'Cette réparation ne peut pas être terminée'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $reparation->terminer();

            // Libérer le slot de réparation
            $slot = Slot::where('id_voiture', $reparation->id_voiture)->first();
            if ($slot) {
                $slot->liberer();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réparation terminée avec succès',
                'data' => $reparation->load('voiture.client', 'intervention')
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la terminaison de la réparation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        $reparation = Reparation::find($id);
        
        if (!$reparation) {
            return response()->json([
                'success' => false,
                'message' => 'Réparation non trouvée'
            ], 404);
        }

        if ($reparation->estEnCours()) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer une réparation en cours'
            ], 400);
        }

        try {
            DB::beginTransaction();

            // Libérer le slot si la réparation est en attente
            if ($reparation->estEnAttente()) {
                $slot = Slot::where('id_voiture', $reparation->id_voiture)->first();
                if ($slot) {
                    $slot->liberer();
                }
            }

            $reparation->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Réparation supprimée avec succès'
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression de la réparation',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byEtat($etat): JsonResponse
    {
        if (!in_array($etat, ['en_attente', 'en_cours', 'terminee'])) {
            return response()->json([
                'success' => false,
                'message' => 'État invalide'
            ], 400);
        }

        $reparations = Reparation::byEtat($etat)->with('voiture.client', 'intervention')->get();

        return response()->json([
            'success' => true,
            'data' => $reparations
        ]);
    }
}
