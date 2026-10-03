// profil.ts (ProfilService)
// Gere la consultation et la mise a jour du profil du patient connecte
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Informations du profil renvoyees par le backend
export interface ProfilInfo {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string | null;
  sexe: string;
  groupeSanguin: string;
  antecedents: string;
  allergies: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfilService {
  private apiUrl = `${environment.apiUrl}/profil`;

  constructor(private http: HttpClient) {}

  // Recupere les informations du patient connecte
  getProfil(): Observable<ProfilInfo> {
    return this.http.get<ProfilInfo>(this.apiUrl);
  }

  // Met a jour les informations du patient connecte
  // Accepte un objet partiel (memes champs que ProfilInfo, tous optionnels), y compris dateNaissance null
  mettreAJour(donnees: Partial<ProfilInfo>): Observable<string> {
    return this.http.put(this.apiUrl, donnees, { responseType: 'text' });
  }
}