// utilisateur-admin.ts (UtilisateurAdminService)
// Gere les patients cote admin : liste/recherche, detail, modification,
// activation/desactivation, suppression
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UtilisateurResume {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateCreation: string;
}

export interface UtilisateurDetail extends UtilisateurResume {
  actif: boolean;
}

export interface UtilisateurModifier {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
}

@Injectable({
  providedIn: 'root'
})
export class UtilisateurAdminService {
  private apiUrl = `${environment.apiUrl}/admin/utilisateurs`;

  constructor(private http: HttpClient) {}

  // recherche optionnelle par nom/prenom/email
  lister(recherche?: string): Observable<UtilisateurResume[]> {
    const url = recherche ? `${this.apiUrl}?recherche=${encodeURIComponent(recherche)}` : this.apiUrl;
    return this.http.get<UtilisateurResume[]>(url);
  }

  detail(id: number): Observable<UtilisateurDetail> {
    return this.http.get<UtilisateurDetail>(`${this.apiUrl}/${id}`);
  }

  modifier(id: number, donnees: UtilisateurModifier): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, donnees);
  }

  // bascule actif/desactive, renvoie le nouvel etat (true ou false)
  basculerStatut(id: number): Observable<boolean> {
    return this.http.patch<boolean>(`${this.apiUrl}/${id}/statut`, {});
  }

  supprimer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}