// tableau-de-bord.ts
// Page d'accueil de l'admin : chiffres cles, evolution des consultations,
// repartition des urgences, activite recente
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { StatistiquesService, Statistiques } from '../../services/statistiques';

@Component({
  selector: 'app-tableau-de-bord',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './tableau-de-bord.html',
  styleUrl: './tableau-de-bord.css'
})
export class TableauDeBord implements OnInit {
  statistiques: Statistiques | null = null;
  chargement = true;
  dateAujourdhui = new Date();

  // valeurs precalculees pour le trace SVG du graphique (evite de le refaire dans le template)
  pointsGraphiqueEvolution = '';
  pointsAireEvolution = '';
  maxEvolution = 1;

  // valeurs precalculees pour le donut SVG (cercles avec stroke-dasharray)
  segmentsDonut: { couleur: string; dasharray: string; dashoffset: string }[] = [];

  constructor(
    private statistiquesService: StatistiquesService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.statistiquesService.obtenir().subscribe({
      next: (reponse) => {
        this.statistiques = reponse;
        this.calculerGraphiqueEvolution();
        this.calculerDonutUrgences();
        this.chargement = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  formaterDateAujourdhui(): string {
    return this.dateAujourdhui.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  pourcentage(partie: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((partie / total) * 100);
  }

  // Construit les points d'une ligne SVG (largeur 600, hauteur 160) a partir des 7 valeurs de la semaine
  private calculerGraphiqueEvolution(): void {
    if (!this.statistiques) return;
    const valeurs = this.statistiques.evolutionConsultations.map(p => p.nombre);
    this.maxEvolution = Math.max(...valeurs, 1);

    const largeur = 600;
    const hauteur = 160;
    const pas = largeur / (valeurs.length - 1);

    const points = valeurs.map((v, i) => {
      const x = i * pas;
      const y = hauteur - (v / this.maxEvolution) * hauteur;
      return `${x},${y}`;
    });

    this.pointsGraphiqueEvolution = points.join(' ');
    // pour la zone remplie sous la courbe : on ferme le trace en bas a droite puis bas a gauche
    this.pointsAireEvolution = `0,${hauteur} ${points.join(' ')} ${largeur},${hauteur}`;
  }

  // Construit les 3 segments du donut (Faible/Modere/Urgent) en cercles SVG superposes
  private calculerDonutUrgences(): void {
    if (!this.statistiques) return;
    const total = this.statistiques.totalEvaluationsGravite;
    const rayon = 60;
    const circonference = 2 * Math.PI * rayon;

    const valeurs = [
      { couleur: '#16a34a', valeur: this.statistiques.repartitionFaible },   // vert
      { couleur: '#f59e0b', valeur: this.statistiques.repartitionModere },  // orange
      { couleur: '#dc2626', valeur: this.statistiques.repartitionUrgent }   // rouge
    ];

    let decalageCumule = 0;
    this.segmentsDonut = valeurs.map(v => {
      const proportion = total === 0 ? 0 : v.valeur / total;
      const longueurSegment = proportion * circonference;
      const segment = {
        couleur: v.couleur,
        dasharray: `${longueurSegment} ${circonference - longueurSegment}`,
        dashoffset: `${-decalageCumule}`
      };
      decalageCumule += longueurSegment;
      return segment;
    });
  }

  iconeActivite(type: string): string {
    if (type === 'UTILISATEUR') return 'person_add';
    if (type === 'DOCUMENT') return 'description';
    return 'warning';
  }

  tempsEcoule(dateIso: string): string {
    const diffMs = Date.now() - new Date(dateIso).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "À l'instant";
    if (minutes < 60) return `Il y a ${minutes} min`;
    const heures = Math.floor(minutes / 60);
    if (heures < 24) return `Il y a ${heures} h`;
    const jours = Math.floor(heures / 24);
    return `Il y a ${jours} j`;
  }
}