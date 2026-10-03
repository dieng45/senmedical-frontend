// accueil.ts
// Page d'accueil : banniere de presentation + 4 cartes de fonctionnalites principales
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css'
})
export class Accueil {
  constructor(private router: Router) {}

  allerVers(chemin: string): void {
    this.router.navigate([chemin]);
  }
}