// conseil.ts (ConseilService)
// Centralise les donnees des fiches conseils sante, partagees entre la liste et la page detail
import { Injectable } from '@angular/core';

export interface ConseilSante {
  slug: string;
  titre: string;
  icone: string;
  couleurTexte: string;
  image: string;
  resume: string;
  contenu: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ConseilService {

  private conseils: ConseilSante[] = [
    {
      slug: 'fievre',
      titre: 'Fièvre',
      icone: 'device_thermostat',
      couleurTexte: '#1565c0',
      image: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=80',
      resume: 'Comment reconnaître et gérer une fièvre au quotidien',
      contenu: [
        'Reposez-vous et hydratez-vous régulièrement, surtout en cas de fortes chaleurs.',
        'Surveillez votre température plusieurs fois par jour à heures régulières.',
        'Consultez un médecin si la fièvre dépasse 3 jours ou dépasse 39°C.',
        'En cas de convulsions, de forte confusion ou de raideur de la nuque, rendez-vous en urgence.',
        'Évitez de vous couvrir excessivement ; privilégiez des vêtements légers.'
      ]
    },
    {
      slug: 'toux',
      titre: 'Toux',
      icone: 'sick',
      couleurTexte: '#17845c',
      image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=1200&q=80',
      resume: 'Conseils et signes d\'alerte à surveiller pour la toux',
      contenu: [
        'Buvez des boissons chaudes (miel, citron, gingembre) pour apaiser la gorge.',
        'Évitez le tabac et les environnements enfumés ou pollués.',
        'Aérez votre logement pour limiter les irritants respiratoires.',
        'Consultez si la toux persiste plus de 2 semaines.',
        'Une toux avec sang ou accompagnée d\'un essoufflement nécessite un avis médical rapide.'
      ]
    },
    {
      slug: 'douleur',
      titre: 'Douleur',
      icone: 'monitor_heart',
      couleurTexte: '#c2255c',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=80',
      resume: 'Que faire face à une douleur et quand consulter',
      contenu: [
        'Notez la localisation, l\'intensité et la durée de la douleur pour en informer un médecin.',
        'Le repos peut aider pour les douleurs musculaires légères et passagères.',
        'Évitez l\'automédication prolongée sans avis médical.',
        'Une douleur intense et soudaine, en particulier thoracique ou abdominale, nécessite une consultation rapide.',
        'N\'hésitez pas à décrire précisément vos symptômes à MediBot IA pour une meilleure orientation.'
      ]
    },
    {
      slug: 'alimentation',
      titre: 'Alimentation',
      icone: 'restaurant',
      couleurTexte: '#b06a17',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80',
      resume: 'Adopter une alimentation équilibrée au quotidien',
      contenu: [
        'Privilégiez une alimentation variée : fruits, légumes, céréales complètes.',
        'Buvez au moins 1,5 litre d\'eau par jour.',
        'Limitez le sel, le sucre et les aliments ultra-transformés.',
        'Adaptez votre alimentation à vos antécédents médicaux (diabète, hypertension, etc).',
        'Répartissez vos repas en 3 prises principales pour un meilleur équilibre.'
      ]
    },
    {
      slug: 'hygiene',
      titre: 'Hygiène',
      icone: 'clean_hands',
      couleurTexte: '#7048b0',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80',
      resume: 'Les bons réflexes d\'hygiène pour rester en bonne santé',
      contenu: [
        'Lavez-vous les mains régulièrement, surtout avant les repas et après les sorties.',
        'Aérez votre logement quotidiennement, au moins 15 minutes.',
        'Changez de vêtements et de literie régulièrement.',
        'Nettoyez et désinfectez les plaies rapidement pour éviter les infections.',
        'Consultez un professionnel en cas d\'infection cutanée persistante.'
      ]
    },
    {
      slug: 'grossesse',
      titre: 'Grossesse',
      icone: 'pregnant_woman',
      couleurTexte: '#be185d',
      image: 'https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=1200&q=80',
      resume: 'Accompagner une grossesse en toute sérénité',
      contenu: [
        'Effectuez des consultations prénatales régulières dès le début de la grossesse.',
        'Adoptez une alimentation riche en fer et en acide folique.',
        'Évitez l\'alcool, le tabac et toute automédication sans avis médical.',
        'Consultez rapidement en cas de saignement, de douleur intense ou de fièvre.',
        'Reposez-vous suffisamment et pratiquez une activité physique douce si votre médecin l\'autorise.'
      ]
    }
  ];

  // Renvoie la liste complete des conseils (utilise par la page liste)
  getTousLesConseils(): ConseilSante[] {
    return this.conseils;
  }

  // Recherche un conseil par son identifiant unique (utilise par la page detail)
  getConseilParSlug(slug: string): ConseilSante | undefined {
    return this.conseils.find(c => c.slug === slug);
  }
}