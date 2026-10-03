// conseil-detail.ts
// Page detail d'un conseil sante : image plein format, contenu complet, navigation retour
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConseilService, ConseilSante } from '../../services/conseil';

@Component({
  selector: 'app-conseil-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './conseil-detail.html',
  styleUrl: './conseil-detail.css'
})
export class ConseilDetail implements OnInit {
  conseil: ConseilSante | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private conseilService: ConseilService
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.conseil = this.conseilService.getConseilParSlug(slug);
    }
    // Si le conseil n'existe pas (mauvais lien), retour a la liste
    if (!this.conseil) {
      this.router.navigate(['/conseils']);
    }
  }
}