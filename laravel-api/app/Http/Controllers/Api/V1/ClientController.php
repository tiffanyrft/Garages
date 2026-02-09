<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class ClientController extends Controller
{
    public function index(): JsonResponse
    {
        $clients = Client::with('voitures')->get();
        return response()->json([
            'success' => true,
            'data' => $clients
        ]);
    }

    public function show($id): JsonResponse
    {
        $client = Client::with('voitures.reparations.intervention')->find($id);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $client
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:100',
            'prenom' => 'required|string|max:100',
            'telephone' => 'required|string|max:30',
            'email' => 'required|email|unique:client,email|max:150',
            'mot_de_passe' => 'required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $client = Client::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Client créé avec succès',
            'data' => $client
        ], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $client = Client::find($id);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|required|string|max:100',
            'prenom' => 'sometimes|required|string|max:100',
            'telephone' => 'sometimes|required|string|max:30',
            'email' => 'sometimes|required|email|unique:client,email,'.$id.',id_client|max:150',
            'mot_de_passe' => 'sometimes|required|string|min:6'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        $client->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Client mis à jour avec succès',
            'data' => $client
        ]);
    }

    public function destroy($id): JsonResponse
    {
        $client = Client::find($id);
        
        if (!$client) {
            return response()->json([
                'success' => false,
                'message' => 'Client non trouvé'
            ], 404);
        }

        $client->delete();

        return response()->json([
            'success' => true,
            'message' => 'Client supprimé avec succès'
        ]);
    }
}
