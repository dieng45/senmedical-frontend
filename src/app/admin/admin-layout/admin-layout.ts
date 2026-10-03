// admin-layout.ts
// Layout simple pour l'espace administrateur : barre laterale + zone de contenu
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, MatIconModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {
  constructor(private authService: AuthService, private router: Router) {}

  seDeconnecter(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}