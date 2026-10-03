// conseils.ts
// Page Conseils sante : grille de categories avec images, navigation vers une page detail au clic
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConseilService, ConseilSante } from '../../services/conseil';

@Component({
  selector: 'app-conseils',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './conseils.html',
  styleUrl: './conseils.css'
})
export class Conseils {
  conseils: ConseilSante[];

  constructor(private conseilService: ConseilService, private router: Router) {
    this.conseils = this.conseilService.getTousLesConseils();
  }

  ouvrirConseil(slug: string): void {
    this.router.navigate(['/conseils', slug]);
  }
}