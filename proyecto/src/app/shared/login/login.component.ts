import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Importaciones de Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-login',
    standalone: true, // Asegura que este componente sea standalone
    imports: [
      CommonModule,
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule
    ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    email: '',
    password: ''
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
