import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  Users, 
  Wrench, 
  DollarSign, 
  Clock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { statistiqueService } from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, dashboardResponse] = await Promise.all([
          statistiqueService.getAll(),
          statistiqueService.getDashboard()
        ]);

        if (statsResponse.success) {
          setStats(statsResponse.data);
        }
        
        if (dashboardResponse.success) {
          setDashboardStats(dashboardResponse.data);
        }
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  const indicateurs = dashboardStats?.indicateurs || {};
  const slots = dashboardStats?.slots || {};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600">Vue d'ensemble de l'activité du garage</p>
      </div>

      {/* Indicateurs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réparations aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{indicateurs.reparations_aujourd_hui || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Réparations en cours</p>
              <p className="text-2xl font-bold text-gray-900">{indicateurs.reparations_en_cours || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-full">
              <Car className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Voitures en attente</p>
              <p className="text-2xl font-bold text-gray-900">{indicateurs.voitures_en_attente || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Paiements en attente</p>
              <p className="text-2xl font-bold text-gray-900">{indicateurs.paiements_en_attente || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques des slots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">État des slots de réparation</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Slots libres</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{slots.reparation_libres || 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-sm text-gray-600">Slots occupés</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">{2 - (slots.reparation_libres || 0)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full" 
                style={{ width: `${((2 - (slots.reparation_libres || 0)) / 2) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Slot d'attente</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {slots.attente_libre ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Disponible</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <span className="text-sm text-gray-600">Occupé</span>
                  </>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {slots.attente_libre 
                ? 'Le slot d\'attente est disponible pour accueillir une nouvelle voiture.'
                : 'Le slot d\'attente est actuellement occupé.'
              }
            </div>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/admin/interventions"
            className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Wrench className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Gérer les interventions</p>
              <p className="text-sm text-gray-600">Ajouter ou modifier des types d'interventions</p>
            </div>
          </Link>

          <Link
            to="/admin/reparations"
            className="flex items-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
          >
            <Car className="h-8 w-8 text-yellow-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Suivre les réparations</p>
              <p className="text-sm text-gray-600">Démarrer ou terminer des réparations</p>
            </div>
          </Link>

          <Link
            to="/admin/clients"
            className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
          >
            <Users className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900">Gérer les clients</p>
              <p className="text-sm text-gray-600">Ajouter ou modifier des clients</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Dernières réparations */}
      {stats?.dernieres_reparations && stats.dernieres_reparations.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Dernières réparations</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Voiture
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Intervention
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.dernieres_reparations.slice(0, 5).map((reparation) => (
                  <tr key={reparation.id_reparation}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reparation.voiture?.marque} {reparation.voiture?.modele}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reparation.voiture?.client?.nom} {reparation.voiture?.client?.prenom}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {reparation.intervention?.nom_intervention}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        reparation.etat === 'terminee' 
                          ? 'bg-green-100 text-green-800'
                          : reparation.etat === 'en_cours'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {reparation.etat === 'terminee' ? 'Terminée' : 
                         reparation.etat === 'en_cours' ? 'En cours' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
