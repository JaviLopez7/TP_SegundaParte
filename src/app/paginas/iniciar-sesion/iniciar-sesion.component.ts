import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

import { Usuario } from '../../interfaces/usuario';
import { AutenticacionService } from '../../servicios/autenticacion.service';

// FIREBASE
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getApps } from 'firebase/app';

const provider = new GoogleAuthProvider();
const firebaseConfig = {
  apiKey: "AIzaSyDkPpRlEopZBiUoFt8GKoD6KLWkws4HqkQ",
  authDomain: "comercio-7a648.firebaseapp.com",
  projectId: "comercio-7a648",
  storageBucket: "comercio-7a648.appspot.com",
  messagingSenderId: "246230784294",
  appId: "1:246230784294:web:c288085c03729ddca849e7"
};

@Component({
  selector: 'app-iniciar-sesion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './iniciar-sesion.component.html',
  styleUrl: './iniciar-sesion.component.css'
})
export class IniciarSesionComponent {
  formularioIniciarSesion: FormGroup;
  errorMensaje = '';

  private app = getApps().length === 0 
  ? initializeApp(firebaseConfig) 
  : getApps()[0];

  private auth = getAuth(this.app);
  private db = getFirestore(this.app);

  constructor(
    private http: HttpClient,
    private router: Router,
    private autenticacion: AutenticacionService
  ) {
    this.formularioIniciarSesion = new FormGroup({
      correo: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}(\.[a-zA-Z]{2})?$/)
      ]),
      contrasenia: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15)
      ])
    });
  }

  get correo() {
  return this.formularioIniciarSesion.get('correo')!;
}

get contrasenia() {
  return this.formularioIniciarSesion.get('contrasenia')!;
}


  // LOGIN TRADICIONAL
  loginTradicional() {
    this.http.post<{ usuario: Usuario }>('http://localhost:3000/iniciarSesion', this.formularioIniciarSesion.value)
      .subscribe({
        next: (response) => {
          const usuario = response.usuario;

          // Si es admin (rol_id = 2) o cliente (rol_id = 1), lo dejamos pasar
          if (usuario.rol_id !== 1 && usuario.rol_id !== 2) {
            this.errorMensaje = 'Rol no autorizado';
            return;
          }

          this.autenticacion.login(usuario);
          this.redirigirPorRol(usuario.rol_id);
        },
        error: (err) => {
          if (err.status === 401 || err.status === 404) {
            this.errorMensaje = 'Correo o contraseña incorrectos';
          } else {
            this.errorMensaje = 'Error del servidor. Inténtalo más tarde.';
          }
        }
      });
  }

  // LOGIN CON GMAIL
  loginConGoogle() {
    signInWithPopup(this.auth, provider)
      .then(async (result) => {
        const user = result.user;
        const userDocRef = doc(this.db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        // Si el usuario no existe, lo creamos con rol "user"
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            nombre: user.displayName,
            id: user.uid,
            rol: 'user'
          });
        }

        const userData = userDoc.exists() ? userDoc.data() : null;
        const rol = userData?.['rol'] ?? 'user';
        const rol_id = rol === 'admin' ? 2 : 1;

        const usuarioFirebase: Usuario = {
          correo: user.email ?? '',
          nombre: user.displayName ?? '',
          apellido: '',
          id: user.uid,
          rol_id: rol_id,
          permisos_especiales: rol_id === 2 ? 'Todos' : ''
        };

        this.autenticacion.login(usuarioFirebase);
        this.redirigirPorRol(rol_id);
      })
      .catch((error) => {
        console.error('Error en autenticación con Google:', error);
        this.errorMensaje = 'No se pudo iniciar sesión con Google';
      });
  }

  redirigirPorRol(rol_id: number) {
    if (rol_id === 1 || rol_id === 2) {
      this.router.navigate(['/gestion']);
    } else {
      this.router.navigate(['/']);
    }
  }
}
