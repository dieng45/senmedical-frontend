// statistiques-admin.ts
// Vue analytique detaillee : repartition des documents par categorie,
// specialites les plus recommandees par MediBot IA, historique complet des urgences
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatistiquesService, Statistiques } from '../../services/statistiques';

@Component({
  selector: 'app-statistiques-admin',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './statistiques-admin.html',
  styleUrl: './statistiques-admin.css'
})
export class StatistiquesAdmin implements OnInit {
  statistiques: Statistiques | null = null;
  chargement = true;

  documentsParCategorie: { categorie: string; nombre: number }[] = [];
  specialites: { specialite: string; nombre: number }[] = [];
  maxDocumentsCategorie = 1;
  maxSpecialite = 1;

  constructor(
    private statistiquesService: StatistiquesService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.statistiquesService.obtenir().subscribe({
      next: (reponse) => {
        this.statistiques = reponse;

        this.documentsParCategorie = Object.entries(reponse.documentsParCategorie)
          .map(([categorie, nombre]) => ({ categorie, nombre }))
          .sort((a, b) => b.nombre - a.nombre);
        this.maxDocumentsCategorie = Math.max(...this.documentsParCategorie.map(d => d.nombre), 1);

        this.specialites = Object.entries(reponse.specialitesLesPlusRecommandees)
          .map(([specialite, nombre]) => ({ specialite, nombre }))
          .sort((a, b) => b.nombre - a.nombre)
          .slice(0, 8); // top 8
        this.maxSpecialite = Math.max(...this.specialites.map(s => s.nombre), 1);

        this.chargement = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  pourcentageBarre(valeur: number, max: number): number {
    return max === 0 ? 0 : Math.round((valeur / max) * 100);
  }

  pourcentage(partie: number, total: number): number {
    return total === 0 ? 0 : Math.round((partie / total) * 100);
  }
}