<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Slot;
use App\Models\Voiture;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SlotController extends Controller
{
    public function index(): JsonResponse
    {
        $slots = Slot::with('voiture.client')->get();
        
        // Organiser les slots par type
        $slotsReparation = $slots->where('type_slot', 'reparation')->values();
        $slotsAttente = $slots->where('type_slot', 'attente')->values();

        return response()->json([
            'success' => true,
            'data' => [
                'slots_reparation' => $slotsReparation,
                'slots_attente' => $slotsAttente,
                'total_slots_reparation' => $slotsReparation->count(),
                'slots_reparation_libres' => $slotsReparation->where('occupe', false)->count(),
                'slots_reparation_occupes' => $slotsReparation->where('occupe', true)->count(),
                'slot_attente_libre' => $slotsAttente->where('occupe', false)->count() > 0,
                'slot_attente_occupe' => $slotsAttente->where('occupe', true)->count() > 0
            ]
        ]);
    }

    public function show($id): JsonResponse
    {
        $slot = Slot::with('voiture.client.reparations.intervention')->find($id);
        
        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Slot non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $slot
        ]);
    }

    public function occuper(Request $request, $id): JsonResponse
    {
        $slot = Slot::find($id);
        
        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Slot non trouvé'
            ], 404);
        }

        if ($slot->estOccupe()) {
            return response()->json([
                'success' => false,
                'message' => 'Ce slot est déjà occupé'
            ], 400);
        }

        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'id_voiture' => 'required|exists:voiture,id_voiture'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $voiture = Voiture::find($request->id_voiture);

        // Vérifier si la voiture n'est pas déjà dans un autre slot
        $slotExistant = Slot::where('id_voiture', $voiture->id_voiture)->first();
        if ($slotExistant) {
            return response()->json([
                'success' => false,
                'message' => 'Cette voiture est déjà dans un slot'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $slot->occuper($voiture);

            // Mettre à jour le statut de la voiture
            if ($slot->type_slot === 'reparation') {
                $voiture->statut = 'en_reparation';
            } else {
                $voiture->statut = 'en_attente';
            }
            $voiture->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Slot occupé avec succès',
                'data' => $slot->load('voiture.client')
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'occupation du slot',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function liberer($id): JsonResponse
    {
        $slot = Slot::find($id);
        
        if (!$slot) {
            return response()->json([
                'success' => false,
                'message' => 'Slot non trouvé'
            ], 404);
        }

        if ($slot->estLibre()) {
            return response()->json([
                'success' => false,
                'message' => 'Ce slot est déjà libre'
            ], 400);
        }

        try {
            DB::beginTransaction();

            $voiture = $slot->voiture;
            
            $slot->liberer();

            // Mettre à jour le statut de la voiture
            if ($voiture) {
                $voiture->statut = 'en_attente';
                $voiture->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Slot libéré avec succès',
                'data' => $slot
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la libération du slot',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function statistiques(): JsonResponse
    {
        $totalSlotsReparation = Slot::reparation()->count();
        $slotsReparationLibres = Slot::reparation()->libres()->count();
        $slotsReparationOccupes = Slot::reparation()->occupes()->count();
        
        $totalSlotsAttente = Slot::attente()->count();
        $slotsAttenteLibres = Slot::attente()->libres()->count();
        $slotsAttenteOccupes = Slot::attente()->occupes()->count();

        $slotsReparationOccupesDetails = Slot::reparation()->occupes()->with('voiture.client')->get();
        $slotAttenteOccupeDetails = Slot::attente()->occupes()->with('voiture.client')->first();

        return response()->json([
            'success' => true,
            'data' => [
                'reparation' => [
                    'total' => $totalSlotsReparation,
                    'libres' => $slotsReparationLibres,
                    'occupes' => $slotsReparationOccupes,
                    'taux_occupation' => $totalSlotsReparation > 0 ? round(($slotsReparationOccupes / $totalSlotsReparation) * 100, 2) : 0,
                    'details' => $slotsReparationOccupesDetails
                ],
                'attente' => [
                    'total' => $totalSlotsAttente,
                    'libres' => $slotsAttenteLibres,
                    'occupes' => $slotsAttenteOccupes,
                    'taux_occupation' => $totalSlotsAttente > 0 ? round(($slotsAttenteOccupes / $totalSlotsAttente) * 100, 2) : 0,
                    'details' => $slotAttenteOccupeDetails
                ],
                'regles_metier' => [
                    'max_slots_reparation' => 2,
                    'max_slots_attente' => 1,
                    'respecte_reparation' => $totalSlotsReparation <= 2,
                    'respecte_attente' => $totalSlotsAttente <= 1
                ]
            ]
        ]);
    }
}
