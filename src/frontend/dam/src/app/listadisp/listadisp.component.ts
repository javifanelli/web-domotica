import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispositivo } from '../interfaces/dispositivo';
import { Clima } from '../interfaces/clima';
import { DispositivoService } from '../services/dispositivo.service';
import { ClimaService } from '../services/clima.service';
import { Subscription } from 'rxjs';
import { catchError, tap, finalize } from 'rxjs/operators';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-listadisp',
  templateUrl: './listadisp.component.html',
  styleUrls: ['./listadisp.component.scss'],
})
export class ListaDispComponent implements OnInit, OnDestroy {
  constructor(
    private deviceService: DispositivoService,
    private weatherService: ClimaService,
    private alertController: AlertController
  ) {}

  devices?: Dispositivo[];
  subscription!: Subscription;
  clima?: Clima;

  ngOnInit(): void {
    this.subscription = this.deviceService.getListaDisp().subscribe((data) => {
      this.devices = data;
    });
  
    this.weatherService.obtenerDatosClima().subscribe(
      (datosClima) => {
        this.clima = datosClima;
        console.log('Datos del clima recibidos correctamente:', datosClima);
      },
      (error) => {
        console.error('Error al obtener datos del clima en el componente:', error);
      }
    );
  }

  async confirmarBorrar(dispositivoId: string) {
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
            this.deviceService.deleteDevice(dispositivoId)
              .pipe(
                tap(() => {
                  console.log('El dispositivo se ha borrado correctamente.');
                }),
                catchError(error => {
                  console.error('Error al borrar el dispositivo:', error);
                  return [];
                }),
                finalize(() => {
                })
              )
              .subscribe(() => {
                window.location.reload();
              });
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