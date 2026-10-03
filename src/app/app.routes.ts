// app.routes.ts
// Definit les routes de l'application SenMedical
import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Chat } from './pages/chat/chat';
import { Accueil } from './pages/accueil/accueil';
import { Conseils } from './pages/conseils/conseils';
import { ConseilDetail } from './pages/conseil-detail/conseil-detail';
import { Consultations } from './pages/consultations/consultations';
import { ConsultationDetailComponent } from './pages/consultation-detail/consultation-detail';
import { PatientLayout } from './layout/patient-layout/patient-layout';
import { Profil } from './pages/profil/profil';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { DocumentsAdmin } from './admin/documents-admin/documents-admin';
import { UtilisateursAdmin } from './admin/utilisateurs-admin/utilisateurs-admin';
import { StatistiquesAdmin } from './admin/statistiques-admin/statistiques-admin';
import { TableauDeBord } from './pages/tableau-de-bord/tableau-de-bord';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  {
    path: '',
    component: PatientLayout,
    children: [
      { path: 'accueil', component: Accueil },
      { path: 'chat', component: Chat },
      { path: 'conseils', component: Conseils },
      { path: 'conseils/:slug', component: ConseilDetail },
      { path: 'consultations', component: Consultations },
      { path: 'consultations/:id', component: ConsultationDetailComponent },
      { path: 'profil', component: Profil }
    ]
  },
  {
    path: 'admin',
    component: AdminLayout,
    children: [
      { path: 'tableau-de-bord', component: TableauDeBord },
      { path: 'utilisateurs', component: UtilisateursAdmin },
      { path: 'documents', component: DocumentsAdmin },
      { path: 'statistiques', component: StatistiquesAdmin }
    ]
  }
];