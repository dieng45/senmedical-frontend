// auth-interceptor.ts
// Ajoute automatiquement le token JWT (Bearer) a chaque requete HTTP sortante
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');

  if (token) {
    const requeteAvecToken = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(requeteAvecToken);
  }

  return next(req);
};