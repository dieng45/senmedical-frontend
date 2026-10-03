// patient-layout.ts
// Layout partage par toutes les pages patient : barre laterale + en-tete
// La barre de recherche est masquee sur les pages Chat et Profil (interfaces dediees)
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, MatIconModule, MatMenuModule],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.css'
})
export class PatientLayout {
  email: string | null = '';
  afficherRecherche = true;

  constructor(private authService: AuthService, private router: Router) {
    this.email = this.authService.getEmail();

    // Masque la barre de recherche sur les pages Chat et Profil (interfaces dediees, sans besoin de recherche)
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      const urlActuelle = this.router.url;
      this.afficherRecherche = !urlActuelle.startsWith('/chat') && !urlActuelle.startsWith('/profil');
    });
  }

  get nomAffiche(): string {
    return this.email ? this.email.split('@')[0] : 'Utilisateur';
  }

  seDeconnecter(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}