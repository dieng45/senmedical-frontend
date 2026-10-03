// register.ts
// Page d'inscription patient : formulaire complet, appelle AuthService.register()
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  // Champs obligatoires
  nom = '';
  prenom = '';
  email = '';
  motDePasse = '';

  // Champs optionnels (profil medical du patient)
  telephone = '';
  dateNaissance: Date | null = null;
  sexe = '';
  groupeSanguin = '';
  antecedents = '';
  allergies = '';

  motDePasseVisible = false;
  chargement = false;
  messageErreur = '';

  constructor(private authService: AuthService, private router: Router) {}

  basculerVisibiliteMotDePasse(): void {
    this.motDePasseVisible = !this.motDePasseVisible;
  }

  sInscrire(): void {
    this.messageErreur = '';
    this.chargement = true;

    // Formatage de la date au format YYYY-MM-DD attendu par le backend (LocalDate)
    const dateFormatee = this.dateNaissance
      ? this.dateNaissance.toISOString().split('T')[0]
      : undefined;

    this.authService.register({
      nom: this.nom,
      prenom: this.prenom,
      email: this.email,
      motDePasse: this.motDePasse,
      telephone: this.telephone || undefined,
      dateNaissance: dateFormatee,
      sexe: this.sexe || undefined,
      groupeSanguin: this.groupeSanguin || undefined,
      antecedents: this.antecedents || undefined,
      allergies: this.allergies || undefined
    }).subscribe({
      next: () => {
        this.chargement = false;
        this.router.navigate(['/accueil']);
      },
      error: (err) => {
        this.chargement = false;
        this.messageErreur = err.status === 409
          ? 'Cet email est déjà utilisé'
          : 'Une erreur est survenue, veuillez réessayer';
      }
    });
  }
}