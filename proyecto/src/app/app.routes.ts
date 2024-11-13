import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    
    {path: '', redirectTo: 'AppComponent.URL', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home/:word', component: HomeComponent},
    {path: 'home', component: HomeComponent},
  
];
