// consultation-detail.ts
// Page detail d'une consultation : affiche tous les messages echanges avec MediBot IA
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConsultationService, ConsultationDetail } from '../../services/consultation';

@Component({
  selector: 'app-consultation-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './consultation-detail.html',
  styleUrl: './consultation-detail.css'
})
export class ConsultationDetailComponent implements OnInit {
  consultation: ConsultationDetail | undefined;
  chargement = true;
  erreur = false;

  constructor(
    private route: ActivatedRoute,
    private consultationService: ConsultationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.consultationService.getDetail(id).subscribe({
      next: (reponse) => {
        this.consultation = reponse;
        this.chargement = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.erreur = true;
        this.chargement = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  formaterHeure(dateIso: string): string {
    return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  classeGravite(gravite: string): string {
    switch (gravite) {
      case 'ELEVE': return 'gravite-elevee';
      case 'MOYEN': return 'gravite-moyenne';
      case 'FAIBLE': return 'gravite-faible';
      default: return '';
    }
  }

  resultatPourIndex(indexMessageBot: number) {
    return this.consultation?.resultats[indexMessageBot];
  }
}