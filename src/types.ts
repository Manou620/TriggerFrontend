export interface Product {
  id: string;
  design: string;
  category: string;
  stock: number;
  price: number;
}

export interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

export interface Sale {
  id: string;
  productId: string;
  clientId: string;
  qteSortie: number;
  date: string;
  status: 'En attente' | 'Validé' | 'Annulé';
}

export interface AuditEntry {
  id: string;
  typeOperation: 'AJOUT' | 'MODIFICATION' | 'SUPPRESSION';
  nomClient: string;
  designProduit: string;
  qteSortieAncien: number;
  qteSortieNouv: number;
  dateMiseAJour: string;
  utilisateur: string;
}
