import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { AlertController } from '@ionic/angular';
import { NgForm } from '@angular/forms';

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

  verificarID(dispositivoId: string): boolean {
    const posicion = 2;
    return dispositivoId.charAt(posicion) === '2' &&
      dispositivoId.charAt(posicion + 1) === '8' &&
      dispositivoId.charAt(posicion + 2) === '1' &&
      dispositivoId.charAt(posicion + 3) === '9';
  }

  async onAgrega(form: NgForm) {
    if (form.valid && this.verificarID(this.nuevoDispositivo.dispositivoId)) {
      await this.agregarDispositivo();
    }
  }

  async agregarDispositivo() {
    try {
      const response = await this.dispositivoService.agregarDispositivo(this.nuevoDispositivo).toPromise();
      console.log('Dispositivo agregado correctamente:', response);
      await this.mostrarMensajeExitoso();
      this.router.navigate(['/dispositivos']);
    } catch (error) {
      console.error('Error al agregar el dispositivo:', error);
      await this.mostrarMensajeError();
    }
  }
}
