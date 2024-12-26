import { Component, Inject } from '@angular/core';
import { Router, RouterOutlet, RouterModule } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./shared/login/login.component";
import { HomeComponent } from "./home/home.component";
import { NgxSpinnerModule } from 'ngx-spinner';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    RouterOutlet,
    DashboardComponent,
    LoginComponent,
    HomeComponent,
    NgxSpinnerModule,
    
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'proyecto';
  static URL = 'app';

  constructor(
    @Inject('AuthService') public conexion: any,
    private router: Router
  ) {}

  logout() {
    this.conexion.cerrarSesion();
    this.router.navigate(['/home']);
  }
}
