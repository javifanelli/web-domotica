import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage {

  nuevoDispositivo: Dispositivo = {
    dispositivoId: '',
    nombre: '',
    ubicacion: '',
    mac: '',
    tipo: '',
    alarma: 25,
    act_al: 0,
  };

  constructor(
    private dispositivoService: DispositivoService,
    private router: Router,
    private alertController: AlertController
  ) {}

  async mostrarMensajeExitoso() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'El dispositivo se ha agregado correctamente.',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  async mostrarMensajeError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Hubo un error al agregar el dispositivo. Por favor, inténtalo nuevamente.',
      buttons: ['Aceptar']
    });

    await alert.present();
  }

  agregarDispositivo() {
    this.dispositivoService.agregarDispositivo(this.nuevoDispositivo).subscribe({
      next: (response) => {
        console.log('Dispositivo agregado correctamente:', response);
        this.mostrarMensajeExitoso();
        this.router.navigate(['/dispositivos']);
      },
      error: (error) => {
        console.error('Error al agregar el dispositivo:', error);
        this.mostrarMensajeError();
      }
    });
  }

}
