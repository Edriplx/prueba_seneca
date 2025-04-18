import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message = '';
  isLoading = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('Componente de registro cargado');
    
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      birthdate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.isLoading = true;
    this.message = '';

    this.http.post('http://localhost:3000/api/auth/register', this.registerForm.value).subscribe({
      next: () => {
        this.message = '@ok Registro exitoso. Revisa tu correo para verificar la cuenta.';
        this.registerForm.reset();
      },
      error: err => {
        this.message = '@error Error en el registro: ' + (err.error?.message || 'Intenta más tarde');
        this.isLoading = false;
      }
    });
  }
}
