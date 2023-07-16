import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { Subscription } from 'rxjs';
import { AlertController } from '@ionic/angular'; // Agrega esta importación

@Component({
  selector: 'app-listadisp',
  templateUrl: './listadisp.component.html',
  styleUrls: ['./listadisp.component.scss'],
})
export class ListaDispComponent implements OnInit, OnDestroy {
  constructor(
    private deviceService: DispositivoService,
    private alertController: AlertController // Agrega el servicio AlertController
  ) {}

  devices?: Dispositivo[];
  subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.deviceService.getListaDisp().subscribe((data) => {
      this.devices = data;
    });
  }

  async confirmarBorrar(dispositivoId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que deseas borrar este dispositivo?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Borrar',
          handler: () => {
            this.deviceService.deleteDevice(dispositivoId).subscribe(
              () => {
                console.log('El dispositivo se ha borrado correctamente.');
              },
              (error) => {
                console.error('Error al borrar el dispositivo:', error);
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}