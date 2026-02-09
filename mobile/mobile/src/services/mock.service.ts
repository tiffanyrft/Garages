import { Car } from "../types/car";

// Mock data pour le développement quand l'API n'est pas disponible
export let mockCars: Car[] = [
  {
    id: 1,
    client_id: 1,
    brand: "Renault",
    model: "Clio",
    license_plate: "AB-123-CD",
    problem_description: "Frein qui fait du bruit et changement d'huile",
    status: "pending",
    repairs: [],
    total_price: 0,
    estimated_duration: 0,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    client_id: 1,
    brand: "Peugeot",
    model: "308",
    license_plate: "EF-456-GH",
    problem_description: "Vidange et contrôle technique",
    status: "in_repair",
    repairs: [
      { id: 1, car_id: 2, description: "Vidange moteur", price: 60, duration: 1 },
      { id: 2, car_id: 2, description: "Filtre à huile", price: 15, duration: 0.5 },
    ],
    total_price: 75,
    estimated_duration: 2,
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-15T09:15:00Z",
  },
  {
    id: 3,
    client_id: 1,
    brand: "Citroën",
    model: "C3",
    license_plate: "IJ-789-KL",
    problem_description: "Changement pneus et plaquettes de frein",
    status: "repaired",
    repairs: [
      { id: 3, car_id: 3, description: "4 pneus neufs", price: 320, duration: 2 },
      { id: 4, car_id: 3, description: "Plaquettes de frein avant", price: 80, duration: 1.5 },
      { id: 5, car_id: 3, description: "Main d'œuvre", price: 120, duration: 3.5 },
    ],
    total_price: 520,
    estimated_duration: 7,
    created_at: "2024-01-13T11:45:00Z",
    updated_at: "2024-01-15T16:30:00Z",
  },
  {
    id: 4,
    client_id: 1,
    brand: "Volkswagen",
    model: "Golf",
    license_plate: "MN-012-OP",
    problem_description: "Réparation climatisation",
    status: "paid",
    repairs: [
      { id: 6, car_id: 4, description: "Recharge climatisation", price: 90, duration: 1 },
      { id: 7, car_id: 4, description: "Contrôle fuites", price: 45, duration: 0.5 },
    ],
    total_price: 135,
    estimated_duration: 1.5,
    created_at: "2024-01-12T09:30:00Z",
    updated_at: "2024-01-14T14:20:00Z",
  },
];

export const mockApi = {
  async getCars(): Promise<Car[]> {
    console.log("Mock: Récupération des voitures...");
    return Promise.resolve(mockCars);
  },

  async getCarById(id: number): Promise<Car> {
    console.log(`Mock: Récupération voiture ${id}...`);
    const car = mockCars.find(c => c.id === id);
    if (car) {
      return Promise.resolve(car);
    } else {
      return Promise.reject(new Error("Voiture non trouvée"));
    }
  },

  async processPayment(carId: number): Promise<void> {
    console.log(`Mock: Traitement paiement voiture ${carId}...`);
    const car = mockCars.find(c => c.id === carId);
    if (car && car.status === 'repaired') {
      car.status = 'paid';
      return Promise.resolve();
    } else {
      return Promise.reject(new Error("Paiement impossible - voiture non réparée"));
    }
  },

  async login(email: string, password: string) {
    console.log(`Mock: Tentative de connexion pour ${email}...`);
    
    // Accepter plusieurs identifiants de test
    const validCredentials = [
      { email: "test@test.com", password: "password", name: "Utilisateur Test" },
      { email: "jean@email.com", password: "password", name: "Jean Dupont" },
      { email: "demo@demo.com", password: "demo", name: "Demo User" },
      { email: "admin@admin.com", password: "admin", name: "Admin User" },
    ];

    const user = validCredentials.find(cred => cred.email === email && cred.password === password);
    
    if (user) {
      console.log("Mock: Connexion réussie !");
      return Promise.resolve({
        user: { id: 1, name: user.name, email: user.email },
        token: "mock-token-" + Date.now()
      });
    } else {
      console.log("Mock: Identifiants incorrects");
      return Promise.reject(new Error("Identifiants incorrects"));
    }
  },

  async register(name: string, email: string, password: string) {
    console.log(`Mock: Inscription de ${name} (${email})...`);
    
    if (name && email && password && password.length >= 6) {
      return Promise.resolve({
        user: { id: Date.now(), name, email },
        token: "mock-token-register-" + Date.now()
      });
    } else {
      return Promise.reject(new Error("Données invalides - le mot de passe doit contenir au moins 6 caractères"));
    }
  },

  async addCar(carData: {
    brand: string;
    model: string;
    license_plate: string;
    problem_description: string;
    client_id: number;
  }): Promise<Car> {
    console.log("Mock: Ajout d'une nouvelle voiture...");
    
    // Vérifier si l'immatriculation existe déjà
    const existingCar = mockCars.find(car => 
      car.license_plate.toLowerCase() === carData.license_plate.toLowerCase()
    );
    
    if (existingCar) {
      return Promise.reject(new Error("Cette immatriculation est déjà utilisée"));
    }

    // Créer la nouvelle voiture
    const newCar: Car = {
      id: Math.max(...mockCars.map(c => c.id)) + 1,
      client_id: carData.client_id,
      brand: carData.brand,
      model: carData.model,
      license_plate: carData.license_plate.toUpperCase(),
      problem_description: carData.problem_description,
      status: "pending",
      repairs: [],
      total_price: 0,
      estimated_duration: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Ajouter à la liste des voitures
    mockCars.push(newCar);
    
    console.log("Mock: Voiture ajoutée avec succès:", newCar);
    return Promise.resolve(newCar);
  },
};
