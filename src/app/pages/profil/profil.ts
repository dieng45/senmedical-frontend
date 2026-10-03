// profil.ts (composant Profil)
// Page "Mon profil" : affiche et permet de modifier les informations personnelles et de sante
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ProfilService, ProfilInfo } from '../../services/profil';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css'
})
export class Profil implements OnInit {
  profil: ProfilInfo | undefined;
  modeEdition = false;
  chargement = true;
  enregistrement = false;
  erreur = false;
  messageSucces = false;

  formulaire: Partial<ProfilInfo> = {};

  constructor(
    private profilService: ProfilService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerProfil();
  }

  chargerProfil(): void {
    this.chargement = true;
    this.profilService.getProfil().subscribe({
      next: (reponse) => {
        this.profil = reponse;
        this.formulaire = { ...reponse };
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

  activerEdition(): void {
    this.formulaire = { ...this.profil };
    this.modeEdition = true;
    this.messageSucces = false;
  }

  annulerEdition(): void {
    this.modeEdition = false;
  }

  enregistrer(): void {
    this.enregistrement = true;
    this.profilService.mettreAJour(this.formulaire).subscribe({
      next: () => {
        this.enregistrement = false;
        this.modeEdition = false;
        this.messageSucces = true;
        this.chargerProfil();
      },
      error: () => {
        this.enregistrement = false;
        this.erreur = true;
        this.changeDetector.detectChanges();
      }
    });
  }
}