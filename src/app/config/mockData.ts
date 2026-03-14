import { Product, Client, Sale, AuditEntry } from '../../types';

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'P1', design: 'iPhone 15 Pro', stock: 45, category: 'Électronique', price: 1200 },
  { id: 'P2', design: 'MacBook Air M2', stock: 12, category: 'Informatique', price: 1400 },
  { id: 'P3', design: 'Sony WH-1000XM5', stock: 28, category: 'Audio', price: 350 },
  { id: 'P4', design: 'Samsung S24 Ultra', stock: 33, category: 'Électronique', price: 1300 },
  { id: 'P5', design: 'iPad Pro 12.9', stock: 15, category: 'Tablettes', price: 1100 },
];

export const INITIAL_CLIENTS: Client[] = [
  { id: 'C1', nom: 'Alice Martin', email: 'alice@example.com', telephone: '0612345678', adresse: 'Paris' },
  { id: 'C2', nom: 'Bob Durand', email: 'bob@example.com', telephone: '0687654321', adresse: 'Lyon' },
  { id: 'C3', nom: 'Charlie Leroy', email: 'charlie@example.com', telephone: '0655443322', adresse: 'Marseille' },
  { id: 'C4', nom: 'David Petit', email: 'david@example.com', telephone: '0611223344', adresse: 'Bordeaux' },
];

export const INITIAL_SALES: Sale[] = [
  { id: 'S1', clientId: 'C1', productId: 'P1', qteSortie: 2, date: '2024-03-10T10:30:00Z', status: 'Validé' },
  { id: 'S2', clientId: 'C2', productId: 'P2', qteSortie: 1, date: '2024-03-11T14:20:00Z', status: 'Validé' },
  { id: 'S3', clientId: 'C1', productId: 'P3', qteSortie: 1, date: '2024-03-12T09:15:00Z', status: 'En attente' },
];

export const INITIAL_AUDIT: AuditEntry[] = [
  {
    id: 'A1',
    typeOperation: 'AJOUT',
    dateMiseAJour: '2024-03-10T10:30:00Z',
    nomClient: 'Alice Martin',
    designProduit: 'iPhone 15 Pro',
    qteSortieAncien: 0,
    qteSortieNouv: 2,
    utilisateur: 'Jean Dupont',
  },
  {
    id: 'A2',
    typeOperation: 'MODIFICATION',
    dateMiseAJour: '2024-03-11T16:45:00Z',
    nomClient: 'Bob Durand',
    designProduit: 'MacBook Air M2',
    qteSortieAncien: 1,
    qteSortieNouv: 2,
    utilisateur: 'Jean Dupont',
  },
];
