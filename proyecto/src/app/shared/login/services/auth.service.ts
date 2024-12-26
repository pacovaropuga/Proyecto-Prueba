import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root', // Esto asegura que el servicio esté disponible globalmente
})
export class AuthService {
  private readonly URL = 'http://localhost:4000'; // Constante para la URL base de la API

  private sesionAbierta = false; // Indica si la sesión está abierta
  private observadorSesion$: Subject<boolean> = new Subject(); // Observador para cambios de sesión

  constructor(private http: HttpClient, private jwtHelperService: JwtHelperService) {}

  // Método para iniciar sesión
  login(user: any): Observable<any> {
    return this.http.post(`${this.URL}/user/singin`, user);
  }

  // Verifica si el usuario está autenticado
  isAuth(): boolean {
    const token = localStorage.getItem('token');
    if (!token || this.jwtHelperService.isTokenExpired(token)) {
      return false;
    }
    return true;
  }

  // Método para cerrar sesión
  cerrarSesion(): void {
    localStorage.removeItem('token'); // Cambiado de sessionStorage a localStorage
    this.cambiarEstadoSesion(); // Notifica el cambio de estado de la sesión
  }

  // Actualiza el estado de la sesión y notifica a los suscriptores
  cambiarEstadoSesion(): void {
    this.sesionAbierta = this.sesionHaIniciado();
    this.observadorSesion$.next(this.sesionAbierta);
  }

  // Verifica si la sesión ha iniciado
  public sesionHaIniciado(): boolean {
    const token = localStorage.getItem('token'); // Verifica en localStorage
    return token ? !this.jwtHelperService.isTokenExpired(token) : false;
  }
}
