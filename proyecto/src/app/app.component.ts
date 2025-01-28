import { Component } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { AuthService } from './shared/login/services/auth.service'; // Importa AuthService

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterModule,
    RouterOutlet,
    NgxSpinnerModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'proyecto';
  static URL = 'app';

  // Inyecta AuthService directamente en el constructor
  constructor(
    public authService: AuthService, // Cambiado de `@Inject('AuthService')` a inyección directa
    private router: Router
  ) {}

  logout() {
    this.authService.cerrarSesion(); // Usa el método del servicio directamente
    this.router.navigate(['/home']);
  }
}
