import { api } from "./api";
import { mockApi } from './mock.service';
import { Car } from '../types/car';

export async function fetchCars(): Promise<Car[]> {
  try {
    const response = await api.get("/cars");
    return response.data;
  } catch (error) {
    console.log("API non disponible, utilisation des données mock");
    return await mockApi.getCars();
  }
}

export const getCarById = async (id: number): Promise<Car> => {
  try {
    const response = await api.get(`/cars/${id}`);
    return response.data;
  } catch (error) {
    console.log("API non disponible, utilisation des données mock");
    return await mockApi.getCarById(id);
  }
};

export const updateCarStatus = async (id: number, status: string): Promise<Car> => {
  try {
    const response = await api.patch(`/cars/${id}/status`, { status });
    return response.data;
  } catch (error) {
    console.log("API non disponible, utilisation des données mock");
    // Simuler la mise à jour du statut
    const cars = await mockApi.getCars();
    const car = cars.find(c => c.id === id);
    if (car) {
      car.status = status as any;
      car.updated_at = new Date().toISOString();
    }
    return car || cars[0];
  }
};

export const processPayment = async (carId: number): Promise<void> => {
  try {
    await api.post(`/cars/${carId}/payment`);
  } catch (error) {
    console.log("API non disponible, utilisation du mock pour le paiement");
    await mockApi.processPayment(carId);
  }
};

export const addCar = async (carData: {
  brand: string;
  model: string;
  license_plate: string;
  problem_description: string;
  client_id: number;
}): Promise<Car> => {
  try {
    const response = await api.post("/cars", carData);
    const newCar = response.data;
    
    console.log(`🚗 Nouvelle voiture ajoutée via API: ${newCar.id}`);
    
    return newCar;
  } catch (error) {
    console.log("API non disponible, utilisation du mock pour l'ajout");
    const newCar = await mockApi.addCar(carData);
    
    console.log(`🚗 Nouvelle voiture ajoutée (mock) et mise en attente: ${newCar.id}`);
    
    return newCar;
  }
};
