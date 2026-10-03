// auth.ts (AuthService)
// Gere l'authentification : inscription, connexion, stockage et lecture du token JWT
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

// Structure des donnees envoyees a l'inscription (correspond a RegisterRequest cote backend)
export interface RegisterRequest {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  telephone?: string;
  dateNaissance?: string;
  sexe?: string;
  groupeSanguin?: string;
  antecedents?: string;
  allergies?: string;
}

// Structure des donnees envoyees a la connexion
export interface LoginRequest {
  email: string;
  motDePasse: string;
}

// Structure de la reponse renvoyee par le backend (correspond a AuthResponse)
export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  // Inscrit un nouveau patient et stocke automatiquement le token recu
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap(response => this.stockerSession(response))
    );
  }

  // Connecte un utilisateur existant et stocke le token recu
  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(response => this.stockerSession(response))
    );
  }

  // Deconnecte l'utilisateur en supprimant les infos stockees localement
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  }

  // Sauvegarde le token et les infos utilisateur dans le stockage local du navigateur
  private stockerSession(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('email', response.email);
    localStorage.setItem('role', response.role);
  }

  // Recupere le token stocke (utilise pour les requetes authentifiees)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Verifie si l'utilisateur est actuellement connecte
  estConnecte(): boolean {
    return this.getToken() !== null;
  }

  // Recupere le role de l'utilisateur connecte (PATIENT ou ADMIN)
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Recupere l'email de l'utilisateur connecte
  getEmail(): string | null {
    return localStorage.getItem('email');
  }
}