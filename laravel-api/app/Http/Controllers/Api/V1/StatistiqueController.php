<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Models\Voiture;
use App\Models\Reparation;
use App\Models\Paiement;
use App\Models\Slot;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class StatistiqueController extends Controller
{
    public function index(): JsonResponse
    {
        // Statistiques générales
        $totalClients = Client::count();
        $totalVoitures = Voiture::count();
        $totalReparations = Reparation::count();
        $totalPaiements = Paiement::where('statut', 'paye')->sum('montant');

        // Répartition des voitures par statut
        $voituresParStatut = Voiture::selectRaw('statut, COUNT(*) as count')
            ->groupBy('statut')
            ->pluck('count', 'statut')
            ->toArray();

        // Répartition des réparations par état
        $reparationsParEtat = Reparation::selectRaw('etat, COUNT(*) as count')
            ->groupBy('etat')
            ->pluck('count', 'etat')
            ->toArray();

        // Statistiques des slots
        $slotsStats = $this->getSlotsStats();

        // Dernières réparations
        $dernieresReparations = Reparation::with('voiture.client', 'intervention')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Réparations en cours
        $reparationsEnCours = Reparation::where('etat', 'en_cours')
            ->with('voiture.client', 'intervention')
            ->get();

        // Chiffre d'affaires mensuel (6 derniers mois)
        $caMensuel = $this->getCAMensuel();

        // Interventions les plus demandées
        $interventionsPopulaires = $this->getInterventionsPopulaires();

        return response()->json([
            'success' => true,
            'data' => [
                'generales' => [
                    'total_clients' => $totalClients,
                    'total_voitures' => $totalVoitures,
                    'total_reparations' => $totalReparations,
                    'chiffre_affaires' => $totalPaiements
                ],
                'voitures_par_statut' => [
                    'en_attente' => $voituresParStatut['en_attente'] ?? 0,
                    'en_reparation' => $voituresParStatut['en_reparation'] ?? 0,
                    'terminee' => $voituresParStatut['terminee'] ?? 0,
                    'payee' => $voituresParStatut['payee'] ?? 0
                ],
                'reparations_par_etat' => [
                    'en_attente' => $reparationsParEtat['en_attente'] ?? 0,
                    'en_cours' => $reparationsParEtat['en_cours'] ?? 0,
                    'terminee' => $reparationsParEtat['terminee'] ?? 0
                ],
                'slots' => $slotsStats,
                'dernieres_reparations' => $dernieresReparations,
                'reparations_en_cours' => $reparationsEnCours,
                'ca_mensuel' => $caMensuel,
                'interventions_populaires' => $interventionsPopulaires
            ]
        ]);
    }

    private function getSlotsStats(): array
    {
        $totalSlotsReparation = Slot::reparation()->count();
        $slotsReparationLibres = Slot::reparation()->libres()->count();
        $slotsReparationOccupes = Slot::reparation()->occupes()->count();

        $slotAttente = Slot::attente()->first();
        $slotAttenteLibre = $slotAttente ? !$slotAttente->occupe : true;

        return [
            'reparation' => [
                'total' => $totalSlotsReparation,
                'libres' => $slotsReparationLibres,
                'occupes' => $slotsReparationOccupes,
                'taux_occupation' => $totalSlotsReparation > 0 ? round(($slotsReparationOccupes / $totalSlotsReparation) * 100, 2) : 0
            ],
            'attente' => [
                'total' => 1,
                'libre' => $slotAttenteLibre,
                'occupe' => !$slotAttenteLibre
            ],
            'regles_metier_respectees' => [
                'max_reparation' => $totalSlotsReparation <= 2,
                'max_attente' => true // Toujours respecté avec notre structure
            ]
        ];
    }

    private function getCAMensuel(): array
    {
        $ca = [];
        
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $mois = $date->format('Y-m');
            $moisLabel = $date->format('M Y');
            
            $montant = Paiement::where('statut', 'paye')
                ->whereMonth('date_paiement', $date->month)
                ->whereYear('date_paiement', $date->year)
                ->sum('montant');
            
            $ca[] = [
                'mois' => $mois,
                'label' => $moisLabel,
                'montant' => $montant
            ];
        }
        
        return $ca;
    }

    private function getInterventionsPopulaires(): array
    {
        return \App\Models\Intervention::withCount('reparations')
            ->orderBy('reparations_count', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($intervention) {
                return [
                    'id' => $intervention->id_intervention,
                    'nom' => $intervention->nom_intervention,
                    'prix' => $intervention->prix,
                    'nombre_reparations' => $intervention->reparations_count,
                    'ca_total' => $intervention->reparations_count * $intervention->prix
                ];
            })
            ->toArray();
    }

    public function dashboard(): JsonResponse
    {
        // Statistiques simplifiées pour le dashboard
        $aujourdHui = now();
        
        $reparationsAujourdHui = Reparation::whereDate('created_at', $aujourdHui)->count();
        $reparationsEnCours = Reparation::where('etat', 'en_cours')->count();
        $voituresEnAttente = Voiture::where('statut', 'en_attente')->count();
        $paiementsEnAttente = Paiement::where('statut', 'en_attente')->count();

        // Slots disponibles
        $slotsReparationLibres = Slot::reparation()->libres()->count();
        $slotAttenteLibre = Slot::attente()->libres()->count() > 0;

        return response()->json([
            'success' => true,
            'data' => [
                'indicateurs' => [
                    'reparations_aujourd_hui' => $reparationsAujourdHui,
                    'reparations_en_cours' => $reparationsEnCours,
                    'voitures_en_attente' => $voituresEnAttente,
                    'paiements_en_attente' => $paiementsEnAttente
                ],
                'slots' => [
                    'reparation_libres' => $slotsReparationLibres,
                    'attente_libre' => $slotAttenteLibre
                ]
            ]
        ]);
    }
}
