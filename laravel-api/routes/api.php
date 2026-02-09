<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\ClientController;
use App\Http\Controllers\Api\V1\VoitureController;
use App\Http\Controllers\Api\V1\InterventionController;
use App\Http\Controllers\Api\V1\ReparationController;
use App\Http\Controllers\Api\V1\SlotController;
use App\Http\Controllers\Api\V1\StatistiqueController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| API versionnée pour le projet Garage Simulation
|
*/

// Routes de test (pour développement)
Route::get('/test', function () {
    return response()->json([
        'message' => 'API Garage fonctionne !',
        'status' => 'success',
        'timestamp' => now()
    ]);
});

// Groupe de routes versionnées
Route::prefix('v1')->group(function () {
    
    // Routes publiques (sans authentification)
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::post('/auth/register', [AuthController::class, 'register']);
    
    // Routes frontoffice (consultation publique)
    Route::get('/clients', [ClientController::class, 'index']);
    Route::get('/clients/{id}', [ClientController::class, 'show']);
    Route::get('/voitures', [VoitureController::class, 'index']);
    Route::get('/voitures/statut/{status}', [VoitureController::class, 'byStatus']);
    Route::get('/voitures/client/{clientId}', [VoitureController::class, 'byClient']);
    Route::get('/reparations', [ReparationController::class, 'index']);
    Route::get('/reparations/etat/{etat}', [ReparationController::class, 'byEtat']);
    Route::get('/slots', [SlotController::class, 'index']);
    Route::get('/slots/statistiques', [SlotController::class, 'statistiques']);
    
    // Routes protégées (avec authentification)
    Route::middleware('auth:sanctum')->group(function () {
        
        // Authentification
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);
        
        // Gestion des clients (backoffice)
        Route::post('/clients', [ClientController::class, 'store']);
        Route::put('/clients/{id}', [ClientController::class, 'update']);
        Route::delete('/clients/{id}', [ClientController::class, 'destroy']);
        
        // Gestion des voitures (backoffice)
        Route::post('/voitures', [VoitureController::class, 'store']);
        Route::put('/voitures/{id}', [VoitureController::class, 'update']);
        Route::delete('/voitures/{id}', [VoitureController::class, 'destroy']);
        
        // Gestion des interventions (backoffice)
        Route::get('/interventions', [InterventionController::class, 'index']);
        Route::get('/interventions/disponibles', [InterventionController::class, 'disponibles']);
        Route::get('/interventions/{id}', [InterventionController::class, 'show']);
        Route::post('/interventions', [InterventionController::class, 'store']);
        Route::put('/interventions/{id}', [InterventionController::class, 'update']);
        Route::delete('/interventions/{id}', [InterventionController::class, 'destroy']);
        
        // Gestion des réparations (backoffice)
        Route::post('/reparations', [ReparationController::class, 'store']);
        Route::put('/reparations/{id}/demarrer', [ReparationController::class, 'demarrer']);
        Route::put('/reparations/{id}/terminer', [ReparationController::class, 'terminer']);
        Route::delete('/reparations/{id}', [ReparationController::class, 'destroy']);
        Route::get('/reparations/{id}', [ReparationController::class, 'show']);
        
        // Gestion des slots (backoffice)
        Route::get('/slots/{id}', [SlotController::class, 'show']);
        Route::put('/slots/{id}/occuper', [SlotController::class, 'occuper']);
        Route::put('/slots/{id}/liberer', [SlotController::class, 'liberer']);
        
        // Statistiques (backoffice)
        Route::get('/statistiques', [StatistiqueController::class, 'index']);
        Route::get('/statistiques/dashboard', [StatistiqueController::class, 'dashboard']);
    });
});
