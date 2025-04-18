import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  form!: FormGroup;
  message = '';
  userId: number = 1;
  lastLogin: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      birthdate: ['', Validators.required]
    });

    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = this.decodeToken(token);
      this.userId = decoded?.id;
      this.http.get<any>(`http://localhost:3000/api/auth/user/${this.userId}`).subscribe({
        next: (user) => {
          this.form.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            address: user.address,
            birthdate: user.birthdate ? user.birthdate.split('T')[0] : ''
          });
          this.lastLogin = new Date(user.lastLogin);
        },
        error: () => {
          this.message = '@error No se pudieron cargar tus datos.';
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.http.put(`http://localhost:3000/api/auth/update-profile/${this.userId}`, this.form.value).subscribe({
      next: () => {
        this.message = '@ok Perfil actualizado correctamente.';
      },
      error: () => {
        this.message = '@error Error al actualizar perfil.';
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  decodeToken(token: string): any {
    try {
      const payload = atob(token.split('.')[1]);
      return JSON.parse(payload);
    } catch (err) {
      console.error('Error al decodificar token:', err);
      return null;
    }
  }
}
