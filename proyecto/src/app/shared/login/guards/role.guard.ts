import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import jwtDecode from 'jwt-decode'; // Importación corregida

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const token = localStorage.getItem('token');

    if (!token) {
      console.log('No token found');
      this.router.navigate(['login']);
      return false;
    }

    try {
      const decodedToken = jwtDecode<{ email: string; user: { role: string } }>(token);

      if (!this.authService.isAuth() || decodedToken.user.role !== expectedRole) {
        console.log('Unauthorized user');
        this.router.navigate(['login']);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Invalid token', error);
      this.router.navigate(['login']);
      return false;
    }
  }
}
