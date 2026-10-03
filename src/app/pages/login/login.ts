// login.ts
// Page de connexion : formulaire email/mot de passe, appelle AuthService.login()
// Redirige vers /admin/tableau-de-bord si ADMIN, vers /accueil si PATIENT
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  motDePasse = '';
  chargement = false;
  messageErreur = '';
  motDePasseVisible = false;

  constructor(private authService: AuthService, private router: Router) {}

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible = !this.motDePasseVisible;
  }

  seConnecter(): void {
    this.messageErreur = '';
    this.chargement = true;

    this.authService.login({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: (reponse) => {
        this.chargement = false;
        // Redirige vers l'interface admin ou patient selon le role de l'utilisateur connecte
        if (reponse.role === 'ADMIN') {
          this.router.navigate(['/admin/tableau-de-bord']);
        } else {
          this.router.navigate(['/accueil']);
        }
      },
      error: (err) => {
        this.chargement = false;
        this.messageErreur = err.status === 401
          ? 'Email ou mot de passe incorrect'
          : 'Une erreur est survenue, veuillez reessayer';
      }
    });
  }
}