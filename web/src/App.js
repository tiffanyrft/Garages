import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/Layout/Header';
import './App.css';

// Import des pages
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';

// Page d'accueil publique (placeholder)
const Home = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Bienvenue sur Garage Pro</h1>
      <p className="text-xl text-gray-600 mb-8">Application de gestion de garage</p>
      <div className="space-x-4">
        <a 
          href="/login" 
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Accès Admin
        </a>
        <a 
          href="/clients" 
          className="inline-block px-6 py-3 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          Voir les clients
        </a>
      </div>
    </div>
  </div>
);

// Pages publiques placeholder
const ClientsPage = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Liste des clients</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Page en construction...</p>
      </div>
    </div>
  </div>
);

const ReparationsPage = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Réparations en cours</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Page en construction...</p>
      </div>
    </div>
  </div>
);

// Pages admin placeholder
const AdminInterventions = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des interventions</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Page en construction...</p>
      </div>
    </div>
  </div>
);

const AdminReparations = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des réparations</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Page en construction...</p>
      </div>
    </div>
  </div>
);

const AdminClients = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Gestion des clients</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-600">Page en construction...</p>
      </div>
    </div>
  </div>
);

// Composant de protection des routes admin
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout principal
const MainLayout = ({ children }) => (
  <div className="min-h-screen bg-gray-50">
    <Header />
    <main className="py-8">
      {children}
    </main>
  </div>
);

// Layout pour la page de login (sans header)
const AuthLayout = ({ children }) => (
  <div className="min-h-screen">
    {children}
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/clients" element={<MainLayout><ClientsPage /></MainLayout>} />
          <Route path="/reparations" element={<MainLayout><ReparationsPage /></MainLayout>} />
          
          {/* Route de login admin */}
          <Route path="/login" element={<AuthLayout><AdminLogin /></AuthLayout>} />
          
          {/* Routes admin protégées */}
          <Route path="/admin/dashboard" element={
            <AdminRoute>
              <MainLayout><AdminDashboard /></MainLayout>
            </AdminRoute>
          } />
          <Route path="/admin/interventions" element={
            <AdminRoute>
              <MainLayout><AdminInterventions /></MainLayout>
            </AdminRoute>
          } />
          <Route path="/admin/reparations" element={
            <AdminRoute>
              <MainLayout><AdminReparations /></MainLayout>
            </AdminRoute>
          } />
          <Route path="/admin/clients" element={
            <AdminRoute>
              <MainLayout><AdminClients /></MainLayout>
            </AdminRoute>
          } />
          
          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
