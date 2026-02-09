export interface Car {
  id: number;
  client_id: number;
  brand: string;
  model: string;
  license_plate: string;
  problem_description: string;
  status: 'pending' | 'in_repair' | 'repaired' | 'paid';
  client_name?: string;
  repairs: Repair[];
  total_price?: number;
  estimated_duration?: number;
  created_at: string;
  updated_at: string;
}

export interface Repair {
  id: number;
  car_id: number;
  description: string;
  price: number;
  duration: number;
}

export type CarStatus = 'pending' | 'in_repair' | 'repaired' | 'paid';

export const getStatusText = (status: CarStatus): string => {
  switch (status) {
    case 'pending':
      return 'En attente';
    case 'in_repair':
      return 'En réparation';
    case 'repaired':
      return 'Terminée';
    case 'paid':
      return 'Récupérée';
    default:
      return status;
  }
};

export const getStatusColor = (status: CarStatus): string => {
  switch (status) {
    case 'pending':
      return '#FFA500';
    case 'in_repair':
      return '#007BFF';
    case 'repaired':
      return '#28A745';
    case 'paid':
      return '#6C757D';
    default:
      return '#000000';
  }
};
