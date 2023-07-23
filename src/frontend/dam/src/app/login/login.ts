import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class LoginPage {
  login = { username: '', password: '' };
  submitted = false;
  loginError = false; // Propiedad para mostrar la advertencia

  constructor(public _loginServ: LoginService) {}

  async onLogin(form: NgForm) {
    this.submitted = true;
    this.loginError = false; // Reiniciar el valor de la advertencia

    if (form.valid) {
      const isAuthenticated = await this._loginServ.login(this.login.username, this.login.password);
      if (!isAuthenticated) {
        // Si la autenticación falló, mostrar la advertencia
        this.loginError = true;
      }
    }
  }

  onEnterKeyPressed(form: NgForm) {
    if (form.valid) {
      this.onLogin(form);
    }
  }
}
