import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { Usuario } from '../interfaces/usuario';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  userData!: Usuario;
  userId!: number;
  userDataUpdated: boolean = false;
  showPassword: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: DispositivoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const userIdParam = params.get('userId');
      if (userIdParam !== null) {
        this.userId = +userIdParam;
        this.loadUserData();
      } else {
        console.error('No se proporcionó un userId en la URL.');
      }
    });
  }

  loadUserData() {
    this.usuarioService.getUser(this.userId).subscribe({
      next: (data: Usuario) => {
        this.userData = data;
      },
      error: (error) => {
        console.error('Error al cargar los datos del usuario:', error);
      }
    });
  }

  actualizarDatos() {
    console.log("Datos", this.userData);
    if (this.userData && this.userId) {
      this.userDataUpdated = true;
      this.usuarioService.updateUser(this.userId, this.userData).subscribe({
        next: () => {
          console.log('Datos del usuario actualizados exitosamente');
          this.mostrarMensajeExitoso();
          this.loadUserData();
        },
        error: (error) => {
          console.error('Error al actualizar los datos del usuario:', this.userId, error);
          this.mostrarError(error);
        }
      });
    } else {
      console.error('No hay datos de usuario o userId para actualizar');
    }
  }
  
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  
  async mostrarMensajeExitoso() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Datos del usuario actualizados exitosamente.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async mostrarError(error: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Ha ocurrido un error al actualizar los datos del usuario.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

}