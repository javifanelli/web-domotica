import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { DispositivoService } from '../services/dispositivo.service';
import { Usuario } from '../interfaces/usuario';
import { Subscription } from 'rxjs';
import { VideoService } from '../services/video.service';
import { Video } from '../interfaces/video';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  userData!: Usuario;
  userId!: number;
  userDataSubscription: Subscription | undefined;
  dvrDataSubscription: Subscription | undefined;
  dvrConfig!: Video;

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
    } else {
      console.error("El usuario actual es nulo");
    }
    this.loadUserData();
    this.loadDvrConfig();
  }

  async logout() {
    // Realiza el logout después de cargar la configuración del DVR y los datos del usuario
    await this.loadUserData();
    await this.loadDvrConfig();

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
        },
      });
    } else {
      console.error('No se proporcionó un userId en home.');
    }
  }
  
  loadDvrConfig() {
    this.dvrDataSubscription = this.videoService.getVideoData().subscribe({
      next: (configs) => {
        console.log('Configuración del DVR cargada: ', configs);
        this.dvrConfig = configs;
      },
      error: (error) => {
        console.error('Error al cargar la configuración del DVR:', error);
      },
    });
  }
  
  openVideoDevice() {
    console.log("Abriendo DVR", this.dvrConfig);
    if (this.dvrConfig) {
      const videoUrl = `http://${this.dvrConfig.dvrAddress}:${this.dvrConfig.dvrPort}`;
      window.open(videoUrl, '_blank');
    } else {
      console.error('Configuración del DVR no disponible.');
    }
  }
  
  async mostrarAviso() {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: 'Debe actualizar los datos de usuario.',
      buttons: ['Aceptar'],
    });
    await alert.present();
  }

  ngOnDestroy() {
    if (this.userDataSubscription) {
      this.userDataSubscription.unsubscribe();
    }
    if (this.dvrDataSubscription) {
      this.dvrDataSubscription.unsubscribe();
    }
    localStorage.removeItem('userId');
  }

}