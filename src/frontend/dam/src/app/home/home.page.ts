import { Component } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private loginService: LoginService, private router: Router, private alertController: AlertController) {}

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
  }
  
}
