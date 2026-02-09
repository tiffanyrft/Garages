<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Intervention;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class InterventionController extends Controller
{
    public function index(): JsonResponse
    {
        $interventions = Intervention::withCount('reparations')->get();
        return response()->json([
            'success' => true,
            'data' => $interventions
        ]);
    }

    public function show($id): JsonResponse
    {
        $intervention = Intervention::with('reparations.voiture.client')->find($id);
        
        if (!$intervention) {
            return response()->json([
                'success' => false,
                'message' => 'Intervention non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $intervention
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom_intervention' => 'required|string|max:100',
            'prix' => 'required|numeric|min:0|max:999999.99',
            'duree_seconde' => 'required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $intervention = Intervention::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Intervention créée avec succès',
            'data' => $intervention
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $intervention = Intervention::find($id);
        
        if (!$intervention) {
            return response()->json([
                'success' => false,
                'message' => 'Intervention non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom_intervention' => 'sometimes|required|string|max:100',
            'prix' => 'sometimes|required|numeric|min:0|max:999999.99',
            'duree_seconde' => 'sometimes|required|integer|min:1'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $intervention->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Intervention mise à jour avec succès',
            'data' => $intervention
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $intervention = Intervention::find($id);
        
        if (!$intervention) {
            return response()->json([
                'success' => false,
                'message' => 'Intervention non trouvée'
            ], 404);
        }

        // Vérifier si des réparations utilisent cette intervention
        if ($intervention->reparations()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette intervention car elle est utilisée par des réparations'
            ], 400);
        }

        $intervention->delete();

        return response()->json([
            'success' => true,
            'message' => 'Intervention supprimée avec succès'
        ]);
    }

    public function disponibles(): JsonResponse
    {
        $interventions = Intervention::all();
        $disponibles = Intervention::getInterventionsDisponibles();

        return response()->json([
            'success' => true,
            'data' => [
                'interventions_existantes' => $interventions,
                'interventions_predefinies' => $disponibles
            ]
        ]);
    }
}
