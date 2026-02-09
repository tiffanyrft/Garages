const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Configuration de la base de données PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL:', err);
  } else {
    console.log('✅ Connecté à PostgreSQL:', res.rows[0]);
  }
});

// Routes d'authentification
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(`🔐 Tentative de connexion pour: ${email}`);
    
    const result = await pool.query(
      'SELECT * FROM client WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ Email non trouvé: ${email}`);
      return res.status(401).json({ 
        error: "Cet email n'existe pas dans notre système. Veuillez vérifier votre email ou créer un compte." 
      });
    }
    
    const client = result.rows[0];
    
    // Vérifier le mot de passe correctement
    if (password !== client.mot_de_passe) {
      console.log(`❌ Mot de passe incorrect pour ${email}: "${password}" != "${client.mot_de_passe}"`);
      return res.status(401).json({ 
        error: "Mot de passe incorrect. Veuillez vérifier votre mot de passe." 
      });
    }
    
    console.log(`✅ Connexion réussie pour ${email}`);
    
    res.json({
      user: { 
        id: client.id_client, 
        name: client.prenom + ' ' + client.nom, 
        email: client.email 
      },
      token: 'real-token-' + Date.now()
    });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: 'Erreur serveur. Veuillez réessayer plus tard.' });
  }
});

app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log(`📝 Tentative d'inscription pour: ${email}`);
    
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: "Veuillez remplir tous les champs (nom, email, mot de passe)." 
      });
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await pool.query(
      'SELECT id_client FROM client WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log(`❌ Email déjà utilisé: ${email}`);
      return res.status(400).json({ 
        error: "Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email." 
      });
    }
    
    const [prenom, nom] = name.split(' ');
    
    const result = await pool.query(
      'INSERT INTO client (nom, prenom, telephone, email, mot_de_passe) VALUES ($1, $2, $3, $4, $5) RETURNING id_client, nom, prenom, email',
      [nom || 'Utilisateur', prenom || 'Test', '0000000000', email, password]
    );
    
    const client = result.rows[0];
    console.log(`✅ Inscription réussie pour: ${email}`);
    
    res.json({
      user: { 
        id: client.id_client, 
        name: client.prenom + ' ' + client.nom, 
        email: client.email 
      },
      token: 'real-token-' + Date.now()
    });
  } catch (error) {
    console.error('Erreur register:', error);
    res.status(500).json({ error: 'Erreur lors de la création du compte. Veuillez réessayer.' });
  }
});

// Routes pour les voitures
app.get('/api/cars', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT v.*, c.nom as client_nom, c.prenom as client_prenom 
      FROM voiture v 
      JOIN client c ON v.id_client = c.id_client 
      ORDER BY v.id_voiture DESC
    `);
    
    // Transformer les données pour correspondre à ce que l'attend l'application mobile
    const cars = result.rows.map(row => ({
      id: row.id_voiture,
      brand: row.marque,
      model: row.modele,
      license_plate: row.immatriculation,
      status: row.statut === 'terminee' ? 'repaired' : 
              row.statut === 'en_reparation' ? 'in_repair' : 
              'pending',
      client_id: row.id_client,
      client_name: row.client_prenom + ' ' + row.client_nom,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));
    
    res.json(cars);
  } catch (error) {
    console.error('Erreur getCars:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/cars/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT v.*, c.nom as client_nom, c.prenom as client_prenom 
      FROM voiture v 
      JOIN client c ON v.id_client = c.id_client 
      WHERE v.id_voiture = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Voiture non trouvée' });
    }
    
    const row = result.rows[0];
    const car = {
      id: row.id_voiture,
      brand: row.marque,
      model: row.modele,
      license_plate: row.immatriculation,
      status: row.statut === 'terminee' ? 'repaired' : 
              row.statut === 'en_reparation' ? 'in_repair' : 
              'pending',
      client_id: row.id_client,
      client_name: row.client_prenom + ' ' + row.client_nom,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.json(car);
  } catch (error) {
    console.error('Erreur getCarById:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/cars', async (req, res) => {
  try {
    const { brand, model, license_plate, problem_description, client_id, selected_repairs, estimated_price } = req.body;
    
    // Insérer la voiture
    const result = await pool.query(
      'INSERT INTO voiture (marque, modele, immatriculation, statut, id_client, total_price) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [brand, model, license_plate, 'en_attente', client_id, estimated_price || 0]
    );
    
    const newCarId = result.rows[0].id_voiture;
    
    // Si des réparations sont sélectionnées, les ajouter dans la table reparation
    if (selected_repairs && Array.isArray(selected_repairs)) {
      console.log(`🔧 Ajout des réparations pour voiture ${newCarId}:`, selected_repairs);
      
      // Mapping des noms de réparations vers IDs d'intervention
      const repairMapping = {
        'frein': 1,
        'vidange': 2,
        'filtre': 3,
        'batterie': 4,
        'amortisseurs': 5,
        'embrayage': 6,
        'pneus': 7,
        'refroidissement': 8
      };
      
      for (const repairId of selected_repairs) {
        const interventionId = repairMapping[repairId];
        if (interventionId) {
          await pool.query(
            'INSERT INTO reparation (etat, id_voiture, id_intervention) VALUES ($1, $2, $3)',
            ['en_attente', newCarId, interventionId]
          );
          console.log(`✅ Réparation ajoutée: ${repairId} (ID: ${interventionId}) pour voiture ${newCarId}`);
        }
      }
    }
    
    const row = result.rows[0];
    const car = {
      id: row.id_voiture,
      brand: row.marque,
      model: row.modele,
      license_plate: row.immatriculation,
      status: 'pending',
      client_id: row.id_client,
      total_price: row.total_price || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log(`🚗 Voiture ajoutée: ${brand} ${model} avec ${selected_repairs?.length || 0} réparations`);
    res.json(car);
  } catch (error) {
    console.error('Erreur addCar:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/cars/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Convertir le statut de l'application vers le format de la base
    const statutBDD = status === 'repaired' ? 'terminee' : 
                     status === 'in_repair' ? 'en_reparation' : 
                     'en_attente';
    
    // Si la voiture est terminée, calculer le prix total des réparations
    let updateQuery = 'UPDATE voiture SET statut = $1';
    let queryParams = [statutBDD, id];
    
    if (status === 'repaired') {
      // Récupérer les réparations associées à cette voiture
      const reparationsResult = await pool.query(`
        SELECT r.prix 
        FROM reparation rep
        JOIN intervention r ON rep.id_intervention = r.id_intervention
        WHERE rep.id_voiture = $1
      `, [id]);
      
      // Calculer le prix total
      const totalPrice = reparationsResult.rows.reduce((sum, row) => sum + parseFloat(row.prix), 0);
      
      updateQuery += ', total_price = $2';
      queryParams = [statutBDD, totalPrice, id];
      
      console.log(`💰 Prix calculé pour voiture ${id}: ${totalPrice}€ (${reparationsResult.rows.length} réparations)`);
    }
    
    updateQuery += ' WHERE id_voiture = $' + (queryParams.length) + ' RETURNING *';
    
    const result = await pool.query(updateQuery, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Voiture non trouvée' });
    }
    
    const row = result.rows[0];
    const car = {
      id: row.id_voiture,
      brand: row.marque,
      model: row.modele,
      license_plate: row.immatriculation,
      status: status,
      client_id: row.id_client,
      client_name: row.client_prenom + ' ' + row.client_nom,
      total_price: row.total_price || 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    res.json(car);
  } catch (error) {
    console.error('Erreur updateCarStatus:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/cars/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'UPDATE voiture SET statut = $1 WHERE id_voiture = $2 RETURNING *',
      ['terminee', id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Voiture non trouvée' });
    }
    
    res.json({ message: 'Paiement effectué avec succès' });
  } catch (error) {
    console.error('Erreur processPayment:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log(`📡 API disponible sur http://192.168.88.24:${PORT}/api`);
});
