import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  uri = 'http://192.168.0.70:8000';
  token: string;

  constructor(private http: HttpClient, private router: Router) {
    this.token = '';
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      let response = await firstValueFrom(this.http.post<any>(this.uri + '/authenticate', { username: username, password: password }));

      if (response && response.token) {
        this.router.navigate(['home']);
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username); // Almacena el nombre de usuario
        console.log("Datos de usuario en el servicio login:", username);
        return true; // Autenticación exitosa
      } else {
        console.log('Credenciales inválidas');
        return false; // Autenticación fallida
      }
    } catch (error) {
      console.error('Error en el servicio de inicio de sesión:', error);
      return false; // Error en la petición
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  }

  public get logIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getCurrentUser(): string | null {
    return localStorage.getItem('username');
  }
}
