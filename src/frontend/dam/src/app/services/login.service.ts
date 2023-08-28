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
        
        if (typeof response.userId === 'number') {
          localStorage.setItem('userId', response.userId.toString());
          console.log("Respuesta", response);
        } else {
          console.log("El userId en la respuesta no es un número válido:", response.userId);
        }
        
        return true;
      } else {
        console.log('Credenciales inválidas');
        return false;
      }
    } catch (error) {
      console.error('Error en el servicio de inicio de sesión:', error);
      return false;
    }
  }
  

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }

  public get logIn(): boolean {
    return localStorage.getItem('token') !== null;
  }

  getCurrentUser(): number | null {
    const userIdString = localStorage.getItem('userId');
    if (userIdString) {
      return parseInt(userIdString, 10);
    }
    return null;
  }
  
}
