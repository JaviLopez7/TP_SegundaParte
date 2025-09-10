import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?$/i;
const SOLO_LETRAS_PATTERN = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const PASSWORD_PATTERN = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './registrar-usuario.component.html',
  styleUrl: './registrar-usuario.component.css'
})
export class RegistrarUsuarioComponent {

  errorMsg: string = '';
  registroExitoso: boolean = false;

  registerForm = new FormGroup({
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern(SOLO_LETRAS_PATTERN)
    ]),
    apellido: new FormControl('', [
      Validators.required,
      Validators.pattern(SOLO_LETRAS_PATTERN)
    ]),
    correo: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    contrasenia: new FormControl('', [
      Validators.required,
      Validators.pattern(PASSWORD_PATTERN)
    ])
  });

  constructor(private router: Router, private http: HttpClient) {}

  soloLetras(event: KeyboardEvent) {
    const inputChar = event.key;
    const pattern = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]$/;
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.warn('Formulario inválido:', this.registerForm.value);
      return;
    }

    this.http.post('http://localhost:3000/registro', this.registerForm.value, { observe: 'response' })
      .subscribe({
        next: (response) => {
          console.log('Respuesta completa:', response);
          if (response.status === 201) {
            this.errorMsg = '';
            this.registroExitoso = true;
            this.registerForm.reset();

            // Esperar 2 segundos antes de redirigir
            setTimeout(() => {
              this.router.navigate(['/iniciar-sesion']);
            }, 2000);
          }
        },
        error: (err) => {
          console.error('Error en el registro', err);
          this.registroExitoso = false;
          if (err.status === 409) {
            this.errorMsg = 'El correo ya está registrado.';
          } else if (err.status === 400) {
            this.errorMsg = 'Datos inválidos. Verificá el formulario.';
          } else {
            this.errorMsg = 'Ocurrió un error inesperado. Intentá nuevamente.';
          }
        }
      });
  }
}



