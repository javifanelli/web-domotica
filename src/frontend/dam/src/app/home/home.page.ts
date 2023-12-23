import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DispositivoService } from '../services/dispositivo.service';
import { Usuario } from '../interfaces/usuario';
import { Subscription } from 'rxjs';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  userData!: Usuario;
  userId!: number;
  userDataSubscription: Subscription | undefined;
  dvrConfig: { dvrAddress: string; dvrPort: number } | undefined;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertController: AlertController,
    private usuarioService: DispositivoService,
    private videoService: VideoService
  ) {}

  ngOnInit() {
    const userId = this.loginService.getCurrentUser();
    if (userId !== null) {
      this.userId = userId;
      console.log("El id en ngoninit de home es:", this.userId);
      this.loadDvrConfig();
    } else {
      console.error("El usuario actual es nulo");
    }
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
            localStorage.removeItem('userId');
            this.router.navigate(['/login']);
          },
          cssClass: 'logout-alert-button.confirm',
        },
      ],
    });
    await alert.present();
  }

  loadUserData() {
    const userId = this.loginService.getCurrentUser();
    if (userId) {
      console.log("Obteniendo datos", userId);
      this.userDataSubscription = this.usuarioService.getUser(userId).subscribe({
        next: (data: Usuario) => {
          this.userData = data;
          console.log('Valor de data.actualizado:', data.updated);
          if (data.updated === 0) {
            this.mostrarAviso();
          }
        },
        error: (error) => {
          console.error('Error al cargar los datos del usuario en home:', error);
        }
      });
    } else {
      console.error('No se proporcionó un userId en home.');
    }
  }
  
  loadDvrConfig() {
    // Llama al servicio para obtener la configuración del DVR
    this.videoService.getVideoData().subscribe({
        next: (config: { dvrAddress: string; dvrPort: number }[]) => {
            if (config && config.length > 0) {
                this.dvrConfig = config[0];
                console.log('Configuración del DVR cargada:', this.dvrConfig);
            } else {
                console.error('Configuración del DVR no encontrada en video.json');
            }
        },
        error: (error) => {
            console.error('Error al cargar la configuración del DVR:', error);
        },
    });
  }
  async mostrarAviso() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Debe actualizar los datos de usuario.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    localStorage.removeItem('userId');
  }

}
