import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible globalmente
})
export class AuthService {
  private readonly URL = 'http://localhost:4000'; // URL base de la API
  private sesionAbierta = false; // Estado de la sesión
  private observadorSesion$: Subject<boolean> = new Subject(); // Observador para cambios de sesión
  private isBrowser: boolean; // Indica si el entorno es un navegador

  constructor(
    private http: HttpClient, 
    private jwtHelperService: JwtHelperService, // Inyección de JwtHelperService
    @Inject(PLATFORM_ID) private platformId: Object // Detección de entorno (navegador o servidor)
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  // Método para iniciar sesión
  login(user: any): Observable<any> {
    return this.http.post(`${this.URL}/api/signin`, user);
  }

  // Verifica si el usuario está autenticado
  isAuth(): boolean {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (!token || this.jwtHelperService.isTokenExpired(token)) {
        return false;
      }
      return true;
    }
    return false; // En SSR, asumimos que no hay sesión activa
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token'); // Elimina el token de localStorage
      this.cambiarEstadoSesion(); // Notifica el cambio de estado de la sesión
    }
  }

  // Actualiza el estado de la sesión y notifica a los suscriptores
  cambiarEstadoSesion(): void {
    this.sesionAbierta = this.sesionHaIniciado();
    this.observadorSesion$.next(this.sesionAbierta);
  }

  // Verifica si la sesión ha iniciado
  public sesionHaIniciado(): boolean {
    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      return token ? !this.jwtHelperService.isTokenExpired(token) : false;
    }
    return false; // En SSR, asumimos que no hay sesión activa
  }
}
