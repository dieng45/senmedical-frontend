// chat.ts
// Page du chatbot medical : reprend la session en cours si elle existe, sinon en demarre une nouvelle.
// Si une reponse ELEVE est detectee, declenche automatiquement la geolocalisation et cherche l'hopital le plus proche.
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConsultationService, MessageAffiche, HopitalProche } from '../../services/consultation';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css'
})
export class Chat implements OnInit, AfterViewChecked {
  @ViewChild('zoneMessages') zoneMessages!: ElementRef<HTMLDivElement>;

  messageEnCours = '';
  chargement = false;
  erreurDemarrage = false;

  // etat de la recherche d'hopital en cas d'urgence
  rechercheHopitalEnCours = false;
  hopitalTrouve: HopitalProche | null = null;
  erreurLocalisation = '';

  constructor(
    private consultationService: ConsultationService,
    private changeDetector: ChangeDetectorRef
  ) {}

  get consultationId(): number | null {
    return this.consultationService.consultationIdActive;
  }

  get messages(): MessageAffiche[] {
    return this.consultationService.messagesActifs;
  }

  ngOnInit(): void {
    if (!this.consultationService.consultationIdActive) {
      this.demarrerNouvelleConsultation();
    }
  }

  ngAfterViewChecked(): void {
    if (this.zoneMessages) {
      this.zoneMessages.nativeElement.scrollTop = this.zoneMessages.nativeElement.scrollHeight;
    }
  }

  private heureActuelle(): string {
    return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  demarrerNouvelleConsultation(): void {
    this.consultationService.demarrerConsultation().subscribe({
      next: (reponse) => {
        const idExtrait = reponse.match(/\d+/);
        this.consultationService.consultationIdActive = idExtrait ? parseInt(idExtrait[0], 10) : null;

        this.consultationService.messagesActifs = [{
          contenu: "Bonjour 👋 Je suis MediBot IA, l'assistant intelligent de SenMédical. Décrivez vos symptômes, je peux vous orienter selon vos besoins, sans poser de diagnostic.",
          expediteur: 'bot',
          heure: this.heureActuelle()
        }];

        this.changeDetector.detectChanges();
      },
      error: () => {
        this.erreurDemarrage = true;
        this.changeDetector.detectChanges();
      }
    });
  }

  envoyerMessage(): void {
    const texte = this.messageEnCours.trim();
    if (!texte || !this.consultationId || this.chargement) {
      return;
    }

    this.consultationService.messagesActifs.push({ contenu: texte, expediteur: 'patient', heure: this.heureActuelle() });
    this.messageEnCours = '';
    this.chargement = true;

    this.consultationService.envoyerMessage(this.consultationId, texte).subscribe({
      next: (reponse) => {
        this.consultationService.messagesActifs.push({
          contenu: reponse.reponseChatbot,
          expediteur: 'bot',
          heure: this.heureActuelle(),
          gravite: reponse.niveauGravite,
          specialite: reponse.specialiteRecommandee
        });
        this.chargement = false;
        this.changeDetector.detectChanges();

        // Cas urgent detecte : on lance automatiquement la recherche d'hopital le plus proche
        if (reponse.niveauGravite === 'ELEVE') {
          this.localiserHopitalLePlusProche();
        }
      },
      error: () => {
        this.consultationService.messagesActifs.push({
          contenu: "Désolé, une erreur est survenue. Veuillez réessayer.",
          expediteur: 'bot',
          heure: this.heureActuelle()
        });
        this.chargement = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  // Demande la position GPS au navigateur, puis cherche l'hopital le plus proche via le backend
  private localiserHopitalLePlusProche(): void {
    if (!this.consultationId) return;

    this.rechercheHopitalEnCours = true;
    this.hopitalTrouve = null;
    this.erreurLocalisation = '';

    if (!navigator.geolocation) {
      this.erreurLocalisation = "La géolocalisation n'est pas disponible sur cet appareil.";
      this.rechercheHopitalEnCours = false;
      this.changeDetector.detectChanges();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.consultationService.localiserUrgence(this.consultationId!, latitude, longitude).subscribe({
          next: (hopital) => {
            this.hopitalTrouve = hopital;
            this.rechercheHopitalEnCours = false;
            this.changeDetector.detectChanges();
          },
          error: () => {
            this.erreurLocalisation = "Impossible de trouver un hôpital à proximité pour le moment.";
            this.rechercheHopitalEnCours = false;
            this.changeDetector.detectChanges();
          }
        });
      },
      () => {
        // le patient a refuse le partage de position, ou une erreur navigateur est survenue
        this.erreurLocalisation = "Impossible d'accéder à votre position. Autorisez la géolocalisation pour trouver l'hôpital le plus proche.";
        this.rechercheHopitalEnCours = false;
        this.changeDetector.detectChanges();
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  // Lien Google Maps classique (pas d'API, gratuit) pour ouvrir l'itineraire vers l'hopital
  lienItineraire(hopital: HopitalProche): string {
    return `https://www.google.com/maps/dir/?api=1&destination=${hopital.latitude},${hopital.longitude}`;
  }

  classeGravite(gravite?: string): string {
    switch (gravite) {
      case 'ELEVE': return 'gravite-elevee';
      case 'MOYEN': return 'gravite-moyenne';
      case 'FAIBLE': return 'gravite-faible';
      default: return '';
    }
  }
}