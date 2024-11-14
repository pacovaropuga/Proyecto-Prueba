import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./dashboard/dashboard.component";
import { LoginComponent } from "./shared/login/login.component";
import { HomeComponent } from "./home/home.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, DashboardComponent, LoginComponent, HomeComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'proyecto';
  static URL = 'app';

  constructor(@Inject(Authservice) public conexion: Authervice, private router: Router) {
}

  logout() {
    this.conexion.cerrarSesión();
    this.router.navigate(['/home']);
  }

}