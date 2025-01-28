import { bootstrapApplication } from '@angular/platform-browser';
import { ApplicationRef } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/shared/login/services/auth.service';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { routes } from './app/app.routes'; // Asegúrate de importar las rutas
import { provideAnimations } from '@angular/platform-browser/animations';

const bootstrap = (): Promise<ApplicationRef> =>
  bootstrapApplication(AppComponent, {
    providers: [
      provideHttpClient(withFetch()), // Habilitar fetch
      provideRouter(routes), // Registrar las rutas
      provideAnimations(),
      AuthService, // Registrar AuthService
      JwtHelperService, // Registrar JwtHelperService
      { provide: JWT_OPTIONS, useValue: {} }, // Proveer opciones para JWT
    ],
  });

export default bootstrap;
