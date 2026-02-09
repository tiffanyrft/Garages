<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'mot_de_passe' => 'required|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation',
                'errors' => $validator->errors()
            ], 422);
        }

        // Pour le backoffice, on utilise un admin fixe pour simplifier
        // En production, vous devriez avoir une table admin séparée
        if ($request->email === 'admin@garage.com' && $request->mot_de_passe === 'admin123') {
            $admin = [
                'id' => 0,
                'nom' => 'Administrateur',
                'email' => 'admin@garage.com',
                'role' => 'admin'
            ];

            // Créer un token simple (en production, utilisez Sanctum)
            $token = 'admin_token_' . time() . '_' . rand(1000, 9999);

            return response()->json([
                'success' => true,
                'message' => 'Connexion réussie',
                'data' => [
                    'user' => $admin,
                    'token' => $token
                ]
            ]);
        }

        // Tentative de connexion client (frontoffice)
        $client = Client::where('email', $request->email)->first();

        if (!$client || !$client->checkPassword($request->mot_de_passe)) {
            return response()->json([
                'success' => false,
                'message' => 'Email ou mot de passe incorrect'
            ], 401);
        }

        // Créer un token pour le client
        $token = $client->createToken('client_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Connexion réussie',
            'data' => [
                'user' => [
                    'id' => $client->id_client,
                    'nom' => $client->nom,
                    'prenom' => $client->prenom,
                    'email' => $client->email,
                    'role' => 'client'
                ],
                'token' => $token
            ]
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Pour l'admin, pas de token à révoquer (simplifié)
        if ($request->user && $request->user['role'] === 'admin') {
            return response()->json([
                'success' => true,
                'message' => 'Déconnexion réussie'
            ]);
        }

        // Pour les clients, révoquer le token
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        // Pour l'admin (simplifié)
        if ($request->header('Authorization') === 'Bearer admin_token') {
            $admin = [
                'id' => 0,
                'nom' => 'Administrateur',
                'email' => 'admin@garage.com',
                'role' => 'admin'
            ];

            return response()->json([
                'success' => true,
                'data' => $admin
            ]);
        }

        // Pour les clients
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Non authentifié'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id_client,
                'nom' => $user->nom,
                'prenom' => $user->prenom,
                'email' => $user->email,
                'role' => 'client'
            ]
        ]);
    }

    public function register(Request $request): JsonResponse
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
        $token = $client->createToken('client_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inscription réussie',
            'data' => [
                'user' => [
                    'id' => $client->id_client,
                    'nom' => $client->nom,
                    'prenom' => $client->prenom,
                    'email' => $client->email,
                    'role' => 'client'
                ],
                'token' => $token
            ]
        ], 201);
    }
}
