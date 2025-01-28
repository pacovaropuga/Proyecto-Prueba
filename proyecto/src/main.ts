import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/shared/login/services/auth.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { routes } from './app/app.routes'; // Asegúrate de importar las rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(withFetch()), // Habilitar fetch
    provideAnimations(),
    provideRouter(routes), // Registrar las rutas
    AuthService, // Registrar AuthService
    JwtHelperService, // Registrar JwtHelperService
    { provide: JWT_OPTIONS, useValue: {} }, // Proveer opciones para JWT
  ],
}).catch((err) => console.error(err));
