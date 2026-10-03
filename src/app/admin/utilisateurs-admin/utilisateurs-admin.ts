// utilisateurs-admin.ts
// Page admin : liste, recherche, activation/desactivation, edition et suppression des patients
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { UtilisateurAdminService, UtilisateurResume, UtilisateurDetail, UtilisateurModifier } from '../../services/utilisateur-admin';

@Component({
  selector: 'app-utilisateurs-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './utilisateurs-admin.html',
  styleUrl: './utilisateurs-admin.css'
})
export class UtilisateursAdmin implements OnInit {
  utilisateurs: UtilisateurResume[] = [];
  chargement = true;
  recherche = '';

  // etats actif/inactif connus, tenus a jour localement pour ne pas re-appeler l'API a chaque affichage
  statutsConnus: { [id: number]: boolean } = {};

  // modal edition
  modalEditionOuvert = false;
  utilisateurEnEdition: UtilisateurModifier = { nom: '', prenom: '', email: '', telephone: '' };
  idEnEdition: number | null = null;
  enregistrementEnCours = false;
  erreurModal = '';

  // confirmation suppression
  idASupprimer: number | null = null;

  constructor(
    private utilisateurAdminService: UtilisateurAdminService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.charger();
  }

  charger(): void {
    this.chargement = true;
    this.utilisateurAdminService.lister(this.recherche).subscribe({
      next: (reponse) => {
        this.utilisateurs = reponse;
        this.chargement = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  // appele a chaque frappe dans la barre de recherche
  onRechercheChange(): void {
    this.charger();
  }

  formaterDate(dateIso: string): string {
    return new Date(dateIso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  initiales(nom: string, prenom: string): string {
    return (prenom.charAt(0) + nom.charAt(0)).toUpperCase();
  }

  estActif(id: number): boolean {
    // par defaut actif tant qu'on n'a pas d'info contraire
    return this.statutsConnus[id] !== false;
  }

  // ---- Activer / Desactiver ----
  basculerStatut(utilisateur: UtilisateurResume): void {
    this.utilisateurAdminService.basculerStatut(utilisateur.id).subscribe({
      next: (nouvelEtat) => {
        this.statutsConnus[utilisateur.id] = nouvelEtat;
        this.changeDetector.detectChanges();
      },
      error: () => alert('Impossible de modifier le statut de ce compte.')
    });
  }

  // ---- Modal edition ----
  ouvrirEdition(utilisateur: UtilisateurResume): void {
    this.idEnEdition = utilisateur.id;
    this.erreurModal = '';
    this.utilisateurAdminService.detail(utilisateur.id).subscribe({
      next: (detail) => {
        this.utilisateurEnEdition = {
          nom: detail.nom,
          prenom: detail.prenom,
          email: detail.email,
          telephone: detail.telephone
        };
        this.statutsConnus[utilisateur.id] = detail.actif;
        this.modalEditionOuvert = true;
        this.changeDetector.detectChanges();
      },
      error: () => alert('Impossible de charger les informations de cet utilisateur.')
    });
  }

  fermerEdition(): void {
    this.modalEditionOuvert = false;
    this.idEnEdition = null;
    this.erreurModal = '';
  }

  enregistrerEdition(): void {
    if (this.idEnEdition === null) return;

    if (!this.utilisateurEnEdition.nom || !this.utilisateurEnEdition.prenom || !this.utilisateurEnEdition.email) {
      this.erreurModal = 'Nom, prénom et email sont obligatoires.';
      return;
    }

    this.enregistrementEnCours = true;
    this.utilisateurAdminService.modifier(this.idEnEdition, this.utilisateurEnEdition).subscribe({
      next: () => {
        this.enregistrementEnCours = false;
        this.fermerEdition();
        this.charger(); // rafraichit la liste avec les nouvelles infos
      },
      error: () => {
        this.enregistrementEnCours = false;
        this.erreurModal = "Erreur lors de l'enregistrement. Vérifiez que l'email n'est pas déjà utilisé.";
        this.changeDetector.detectChanges();
      }
    });
  }

  // ---- Suppression ----
  demanderSuppression(id: number): void {
    this.idASupprimer = id;
  }

  annulerSuppression(): void {
    this.idASupprimer = null;
  }

  confirmerSuppression(): void {
    if (this.idASupprimer === null) return;
    const id = this.idASupprimer;
    this.utilisateurAdminService.supprimer(id).subscribe({
      next: () => {
        this.idASupprimer = null;
        this.charger();
      },
      error: () => {
        this.idASupprimer = null;
        alert('Impossible de supprimer ce compte.');
        this.changeDetector.detectChanges();
      }
    });
  }
}