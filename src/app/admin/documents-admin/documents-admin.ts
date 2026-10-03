// documents-admin.ts
// Page admin : liste, ajout (upload PDF avec extraction automatique) et suppression des documents
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DocumentService, DocumentMedical } from '../../services/document';

@Component({
  selector: 'app-documents-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './documents-admin.html',
  styleUrl: './documents-admin.css'
})
export class DocumentsAdmin implements OnInit {
  documents: DocumentMedical[] = [];
  chargement = true;

  afficherFormulaire = false;
  enregistrement = false;
  messageErreur = '';

  nouveauTitre = '';
  nouvelleSource = '';
  nouvelleCategorie = '';
  fichierSelectionne: File | null = null;
  glisserActif = false;

  constructor(
    private documentService: DocumentService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDocuments();
  }

  chargerDocuments(): void {
    this.chargement = true;
    this.documentService.lister().subscribe({
      next: (reponse) => {
        this.documents = reponse;
        this.chargement = false;
        this.changeDetector.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.changeDetector.detectChanges();
      }
    });
  }

  ouvrirFormulaire(): void {
    this.afficherFormulaire = true;
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.nouveauTitre = '';
    this.nouvelleSource = '';
    this.nouvelleCategorie = '';
    this.fichierSelectionne = null;
    this.messageErreur = '';
  }

  // Declenchee au choix d'un fichier via le clic sur la zone
  surSelectionFichier(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.definirFichier(input.files[0]);
    }
  }

  // Gestion du glisser-deposer
  surSurvolGlisser(event: DragEvent): void {
    event.preventDefault();
    this.glisserActif = true;
  }

  surSortieGlisser(event: DragEvent): void {
    event.preventDefault();
    this.glisserActif = false;
  }

  surDeposeFichier(event: DragEvent): void {
    event.preventDefault();
    this.glisserActif = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.definirFichier(event.dataTransfer.files[0]);
    }
  }

  private definirFichier(fichier: File): void {
    if (fichier.type !== 'application/pdf') {
      this.messageErreur = 'Seuls les fichiers PDF sont acceptés.';
      return;
    }
    if (fichier.size > 10 * 1024 * 1024) {
      this.messageErreur = 'Le fichier ne doit pas dépasser 10 Mo.';
      return;
    }
    this.messageErreur = '';
    this.fichierSelectionne = fichier;
  }

  retirerFichier(): void {
    this.fichierSelectionne = null;
  }

  // Formate la taille du fichier en Ko/Mo pour l'affichage
  formaterTaille(octets: number): string {
    if (octets < 1024 * 1024) {
      return (octets / 1024).toFixed(0) + ' Ko';
    }
    return (octets / (1024 * 1024)).toFixed(1) + ' Mo';
  }

  ajouterDocument(): void {
    if (!this.nouveauTitre.trim() || !this.fichierSelectionne) {
      this.messageErreur = 'Le titre et le fichier PDF sont obligatoires.';
      return;
    }

    this.enregistrement = true;
    this.messageErreur = '';

    this.documentService.ajouter(
      this.nouveauTitre,
      this.nouvelleSource,
      this.nouvelleCategorie,
      this.fichierSelectionne
    ).subscribe({
      next: () => {
        this.enregistrement = false;
        this.fermerFormulaire();
        this.chargerDocuments();
      },
      error: (err) => {
        this.enregistrement = false;
        this.messageErreur = err.error || 'Une erreur est survenue lors de l\'ajout du document.';
        this.changeDetector.detectChanges();
      }
    });
  }

  supprimerDocument(id: number): void {
    const confirmation = window.confirm('Supprimer ce document de la base de connaissances ?');
    if (!confirmation) {
      return;
    }

    this.documentService.supprimer(id).subscribe({
      next: () => {
        this.documents = this.documents.filter(d => d.id !== id);
        this.changeDetector.detectChanges();
      },
      error: () => {
        window.alert('Impossible de supprimer ce document.');
      }
    });
  }

  formaterDate(dateIso: string): string {
    return new Date(dateIso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}