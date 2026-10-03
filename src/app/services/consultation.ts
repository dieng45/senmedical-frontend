// consultation.ts (ConsultationService)
// Gere les appels vers le backend : demarrer, envoyer des messages, historique, detail, suppression, localiser une urgence
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface ConsultationResponse {
  consultationId: number;
  reponseChatbot: string;
  specialiteRecommandee: string;
  niveauGravite: string;
  urgenceDeclenchee: boolean;
}

export interface ConsultationResume {
  id: number;
  dateDebut: string;
  statut: string;
  specialiteRecommandee: string | null;
  niveauGravite: string | null;
}

export interface MessageDetail {
  contenu: string;
  expediteur: string;
  dateEnvoi: string;
}

export interface ResultatDetail {
  specialiteRecommandee: string;
  niveauGravite: string;
  recommandation: string;
}

export interface ConsultationDetail {
  id: number;
  dateDebut: string;
  statut: string;
  messages: MessageDetail[];
  resultats: ResultatDetail[];
}

export interface MessageAffiche {
  contenu: string;
  expediteur: 'patient' | 'bot';
  heure: string;
  gravite?: string;
  specialite?: string;
}

export interface HopitalProche {
  nom: string;
  latitude: number;
  longitude: number;
  telephone: string | null;
  distanceKm: number;
}

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = `${environment.apiUrl}/consultations`;

  consultationIdActive: number | null = null;
  messagesActifs: MessageAffiche[] = [];

  constructor(private http: HttpClient) {}

  demarrerConsultation(): Observable<string> {
    return this.http.post(`${this.apiUrl}/demarrer`, {}, { responseType: 'text' });
  }

  envoyerMessage(consultationId: number, contenu: string): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(`${this.apiUrl}/${consultationId}/messages`, { contenu });
  }

  getHistorique(): Observable<ConsultationResume[]> {
    return this.http.get<ConsultationResume[]>(`${this.apiUrl}/historique`);
  }

  getDetail(consultationId: number): Observable<ConsultationDetail> {
    return this.http.get<ConsultationDetail>(`${this.apiUrl}/${consultationId}`);
  }

  // Supprime une consultation
  supprimerConsultation(consultationId: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${consultationId}`, { responseType: 'text' });
  }

  // Envoie la position GPS du patient en cas d'urgence, recoit l'hopital le plus proche
  localiserUrgence(consultationId: number, latitude: number, longitude: number): Observable<HopitalProche> {
    return this.http.post<HopitalProche>(`${this.apiUrl}/${consultationId}/urgence/localiser`, { latitude, longitude });
  }
}