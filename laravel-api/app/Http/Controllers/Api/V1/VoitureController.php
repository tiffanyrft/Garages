<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Voiture;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class VoitureController extends Controller
{
    public function index(): JsonResponse
    {
        $voitures = Voiture::with('client', 'reparations.intervention', 'paiement')->get();
        return response()->json([
            'success' => true,
            'data' => $voitures
        ]);
    }

    public function show($id): JsonResponse
    {
        $voiture = Voiture::with('client', 'reparations.intervention', 'paiement')->find($id);
        
        if (!$voiture) {
            return response()->json([
                'success' => false,
                'message' => 'Voiture non trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $voiture
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'marque' => 'required|string|max:100',
            'modele' => 'required|string|max:100',
            'immatriculation' => 'required|string|unique:voiture,immatriculation|max:50',
            'id_client' => 'required|exists:client,id_client'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['statut'] = 'en_attente'; // Statut par défaut
        
        $voiture = Voiture::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Voiture créée avec succès',
            'data' => $voiture->load('client')
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $voiture = Voiture::find($id);
        
        if (!$voiture) {
            return response()->json([
                'success' => false,
                'message' => 'Voiture non trouvée'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'marque' => 'sometimes|required|string|max:100',
            'modele' => 'sometimes|required|string|max:100',
            'immatriculation' => 'sometimes|required|string|unique:voiture,immatriculation,'.$id.',id_voiture|max:50',
            'statut' => 'sometimes|required|in:en_attente,en_reparation,terminee,payee',
            'id_client' => 'sometimes|required|exists:client,id_client'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $voiture->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Voiture mise à jour avec succès',
            'data' => $voiture->load('client')
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $voiture = Voiture::find($id);
        
        if (!$voiture) {
            return response()->json([
                'success' => false,
                'message' => 'Voiture non trouvée'
            ], 404);
        }

        $voiture->delete();

        return response()->json([
            'success' => true,
            'message' => 'Voiture supprimée avec succès'
        ]);
    }

    public function byStatus($status): JsonResponse
    {
        if (!in_array($status, ['en_attente', 'en_reparation', 'terminee', 'payee'])) {
            return response()->json([
                'success' => false,
                'message' => 'Statut invalide'
            ], 400);
        }

        $voitures = Voiture::byStatus($status)->with('client')->get();

        return response()->json([
            'success' => true,
            'data' => $voitures
        ]);
    }

    public function byClient($clientId): JsonResponse
    {
        $client = Client::find($clientId);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $voitures = Voiture::byClient($clientId)->with('reparations.intervention')->get();

        return response()->json([
            'success' => true,
            'data' => $voitures
        ]);
    }
}
