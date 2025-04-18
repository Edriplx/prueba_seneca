import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  
  goToRegister() {
    this.router.navigate(['/register']);
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    this.http.post('http://localhost:3000/api/auth/login', this.loginForm.value).subscribe({
      next: (res: any) => {
        this.message = '@ok Login exitoso';
        localStorage.setItem('token', res.token);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.message = '@error ' + (err.error?.message || 'Error en el servidor');
        this.isLoading = false;
      }
    });
  }
}
