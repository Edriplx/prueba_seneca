import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  form!: FormGroup;
  token = '';
  message = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    
    this.form = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      },
      { validators: this.passwordsMatchValidator }
    );
  }

  passwordsMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.http.post('http://localhost:3000/api/auth/reset-password', {
      token: this.token,
      password: this.form.value.password
    }).subscribe({
      next: () => {
        this.message = '@ok Contraseña actualizada correctamente. Redirigiendo al login...';
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      error: () => {
        this.message = '@error Token inválido o expirado.';
      }
    });
  }
}
