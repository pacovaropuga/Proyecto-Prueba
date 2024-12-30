import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    email: 'asdf',
    password: 'asdf'
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('LoginComponent initialized');
  }

  login(): void {
    console.log('Attempting login with user:', this.user);
    this.authService.login(this.user).subscribe({
      next: (res: any) => {
        console.log('Login successful:', res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.error('Login failed:', err);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}
