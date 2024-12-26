import { Routes } from '@angular/router';
import { LoginComponent } from './shared/login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RoleGuard } from './shared/login/guards/role.guard';

export const routes: Routes = [
    
    {path: '', redirectTo: 'AppComponent.URL', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'home/:word', component: HomeComponent},
    {path: 'home', component: HomeComponent},
    {path: 'dashboard', component: DashboardComponent, canActivate: [RoleGuard], data: {expectedRole: 'admin'}},    
  
];
