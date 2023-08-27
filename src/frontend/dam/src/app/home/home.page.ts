import { Component, OnInit } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DispositivoService } from '../services/dispositivo.service';
import { Usuario } from '../interfaces/usuario';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userData!: Usuario;
  user!: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertController: AlertController,
    private usuarioService: DispositivoService
  ) {}

  ngOnInit() {
    this.user = this.loginService.getCurrentUser() || ''; // Obtener el nombre de usuario autenticado
    console.log("Usuario al inicio:", this.user);
    /* this.loadUserData(); */
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'logout-alert-button.cancel',
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.loginService.logout();
            this.router.navigate(['/login']);
          },
          cssClass: 'logout-alert-button.confirm',
        },
      ],
    });
    await alert.present();
    this.loadUserData();
  }  

  loadUserData() {
    const username = this.loginService.getCurrentUser();
    if (username) {
      this.usuarioService.getUser(this.user).subscribe(
        (data: Usuario) => {
          this.userData = data;
        },
        (error) => {
          console.error('Error al cargar los datos del usuario en home:', error);
        }
      );
    } else {
      console.error('No se proporcionó un nombre de usuario en home.');
    }
  }
  
}
