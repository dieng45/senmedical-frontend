// document.ts (DocumentService)
// Gere les appels vers le backend pour la gestion des documents medicaux (admin), avec upload PDF
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface DocumentMedical {
  id: number;
  titre: string;
  source: string;
  categorie: string;
  dateAjout: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = `${environment.apiUrl}/admin/documents`;

  constructor(private http: HttpClient) {}

  lister(): Observable<DocumentMedical[]> {
    return this.http.get<DocumentMedical[]>(this.apiUrl);
  }

  // Envoie le fichier PDF + les metadonnees au backend, qui extrait le texte et le vectorise
  ajouter(titre: string, source: string, categorie: string, fichier: File): Observable<DocumentMedical> {
    const formData = new FormData();
    formData.append('titre', titre);
    formData.append('source', source);
    formData.append('categorie', categorie);
    formData.append('fichier', fichier);

    return this.http.post<DocumentMedical>(this.apiUrl, formData);
  }

  supprimer(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }
}