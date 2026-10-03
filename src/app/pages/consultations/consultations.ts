// consultations.ts
// Page "Mes consultations" : liste filtrable par gravite, panneau detail, suppression
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ConsultationService, ConsultationResume, ConsultationDetail } from '../../services/consultation';

type FiltreGravite = 'TOUTES' | 'FAIBLE' | 'MOYEN' | 'ELEVE';

@Component({
  selector: 'app-consultations',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './consultations.html',
  styleUrl: './consultations.css'
})
export class Consultations implements OnInit {
  consultations: ConsultationResume[] = [];
  chargement = true;
  erreur = false;

  filtreActif: FiltreGravite = 'TOUTES';

  consultationSelectionnee: ConsultationDetail | undefined;
  chargementDetail = false;

  constructor(
    private consultationService: ConsultationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.consultationService.getHistorique().subscribe({
      next: (reponse) => {
        this.consultations = reponse;
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

  compterParGravite(gravite: FiltreGravite): number {
    if (gravite === 'TOUTES') {
      return this.consultations.length;
    }
    return this.consultations.filter(c => c.niveauGravite === gravite).length;
  }

  get consultationsFiltrees(): ConsultationResume[] {
    if (this.filtreActif === 'TOUTES') {
      return this.consultations;
    }
    return this.consultations.filter(c => c.niveauGravite === this.filtreActif);
  }

  changerFiltre(filtre: FiltreGravite): void {
    this.filtreActif = filtre;
  }

  ouvrirDetail(id: number): void {
    this.chargementDetail = true;
    this.consultationSelectionnee = undefined;

    this.consultationService.getDetail(id).subscribe({
      next: (reponse) => {
        this.consultationSelectionnee = reponse;
        this.chargementDetail = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.chargementDetail = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  // Supprime une consultation apres confirmation, et met a jour la liste et le detail affiches
  supprimerConsultation(id: number, event: Event): void {
    event.stopPropagation(); // empeche le clic de declencher aussi ouvrirDetail()

    const confirmation = window.confirm('Voulez-vous vraiment supprimer cette consultation ? Cette action est irreversible.');
    if (!confirmation) {
      return;
    }

    this.consultationService.supprimerConsultation(id).subscribe({
      next: () => {
        this.consultations = this.consultations.filter(c => c.id !== id);
        if (this.consultationSelectionnee?.id === id) {
          this.consultationSelectionnee = undefined;
        }
        this.changeDetector.detectChanges();
      },
      error: () => {
        window.alert('Impossible de supprimer cette consultation. Réessayez plus tard.');
      }
    });
  }

  formaterDate(dateIso: string): string {
    const date = new Date(dateIso);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }) +
           ' • ' + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  formaterHeure(dateIso: string): string {
    return new Date(dateIso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  classeGravite(gravite: string | null): string {
    switch (gravite) {
      case 'ELEVE': return 'gravite-elevee';
      case 'MOYEN': return 'gravite-moyenne';
      case 'FAIBLE': return 'gravite-faible';
      default: return '';
    }
  }

  libelleGravite(gravite: string | null): string {
    switch (gravite) {
      case 'ELEVE': return 'Urgent';
      case 'MOYEN': return 'Modéré';
      case 'FAIBLE': return 'Faible';
      default: return 'En cours';
    }
  }
}