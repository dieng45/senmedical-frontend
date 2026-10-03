// statistiques.ts (StatistiquesService)
// Recupere les chiffres cles et donnees des graphiques pour le tableau de bord et la page Statistiques
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PointEvolution {
  jour: string;
  nombre: number;
}

export interface Activite {
  type: 'UTILISATEUR' | 'DOCUMENT' | 'URGENCE';
  titre: string;
  sousTitre: string;
  date: string;
}

export interface Statistiques {
  totalPatients: number;
  totalConsultations: number;
  totalDocuments: number;
  totalEvaluationsGravite: number;
  repartitionFaible: number;
  repartitionModere: number;
  repartitionUrgent: number;
  evolutionConsultations: PointEvolution[];
  activiteRecente: Activite[];
  documentsParCategorie: { [categorie: string]: number };
  specialitesLesPlusRecommandees: { [specialite: string]: number };
}

@Injectable({
  providedIn: 'root'
})
export class StatistiquesService {
  private apiUrl = `${environment.apiUrl}/admin/statistiques`;

  constructor(private http: HttpClient) {}

  obtenir(): Observable<Statistiques> {
    return this.http.get<Statistiques>(this.apiUrl);
  }
}