import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent implements OnInit {
  message = 'Verificando cuenta...';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.http.post('http://localhost:3000/api/auth/verify-email', { token }).subscribe({
        next: () => {
          this.message = '@ok Tu cuenta ha sido verificada con éxito. Redirecionando a inicio de sesión...';
          setTimeout(() => this.router.navigate(['/login']), 3000);
        },
        error: () => {
          this.message = '@error Token inválido o expirado.';
        }
      });
    } else {
      this.message = '@error No se encontró el token en el enlace.';
    }
  }
}
