import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// FIREBASE
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, getRedirectResult } from "firebase/auth";


const EMAIL_PATTERN = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?$/i;
const provider = new GoogleAuthProvider();

@Component({
  selector: 'app-iniciar-sesion',
  imports: [RouterLink, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent {

  formularioIniciarSesion!: FormGroup;
  errorMensaje: string = '';

  //FIREBASE
  private app;
  private auth;

  constructor(private router: Router, private http: HttpClient) {
    this.formularioIniciarSesion = new FormGroup({
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern(EMAIL_PATTERN),
      ]),
      contrasenia: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
      ]),
    });

    //FIREBASE
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);

  }

  get correo() {
    return this.formularioIniciarSesion.get('correo')!;
  }

  get contrasenia() {
    return this.formularioIniciarSesion.get('contrasenia')!;
  }

  onSubmit() {
    this.http.post('http://localhost:3000/iniciarSesion', this.formularioIniciarSesion.value, { observe: 'response' })
      .subscribe({
        next: (response) => {
          if (response.status === 200) {
            console.log('Inicio de sesión exitoso');
            this.router.navigate(['/gestion']); // Cambiá esta ruta si es necesario
          }
        },
        error: (err) => {
          if (err.status === 401 || err.status === 404) {
            this.errorMensaje = 'Correo o contraseña incorrectos';
          } else {
            this.errorMensaje = 'Usuario o contraseña incorrectos';
          }
        }
      });
  }


  entrar() {

    localStorage.setItem('usuario', '');
    signInWithPopup(this.auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log(token);
        // The signed-in user info.
        const user = result.user;
        console.info(user);
        localStorage.setItem('usuario', '{"email":"' + user.email + '","nombre":"' + user.displayName
          + '","id":"' + user.uid + '"}');
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      }).catch((error) => {
  // Mostrar el error completo para diagnóstico
  console.error('Error en la autenticación:', error);

  const errorCode = error.code;
  const errorMessage = error.message;
  const email = error.customData ? error.customData.email : null; // Para evitar errores de undefined

  console.log(`Error: ${errorCode} - ${errorMessage}`);
  console.log(`Email: ${email}`);
});
  }
}

const firebaseConfig = {
  apiKey: "AIzaSyDkPpRlEopZBiUoFt8GKoD6KLWkws4HqkQ",
  authDomain: "comercio-7a648.firebaseapp.com",
  projectId: "comercio-7a648",
  storageBucket: "comercio-7a648.firebasestorage.app",
  messagingSenderId: "246230784294",
  appId: "1:246230784294:web:c288085c03729ddca849e7",
  measurementId: "G-4VYBQ02Y6L"
};



