import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { Dispositivo } from '../interfaces/dispositivo';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  dispositivoId!: number;
  ubicacionold!: string;
  dispositivo: Dispositivo = {
    dispositivoId: 0,
    nombre: '',
    ubicacion: '',
    mac: '',
    tipo: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dispositivoService: DispositivoService,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.dispositivoId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.cargarDispositivo();
  }

  async cargarDispositivo() {
    try {
      this.dispositivoService.getDeviceById(this.dispositivoId).subscribe(
        dispositivos => {
          if (dispositivos && dispositivos.length > 0) {
            this.dispositivo = dispositivos[0];
            this.ubicacionold = dispositivos[0].ubicacion;
          }
        },
        error => {
          console.error('Error al cargar el dispositivo:', error);
        }
      );
    } catch (error) {
      console.error('Error al cargar el dispositivo:', error);
    }
  }
  
  async guardarCambios() {
    try {
      if (this.dispositivo) {
        this.dispositivoService.actualizarDispositivo(this.dispositivo as Dispositivo).subscribe(
          () => {
            this.mostrarMensajeExitoso();
            this.router.navigate(['/home']);
          },
          (error) => {
            this.mostrarError(error);
            console.error('Error al actualizar:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }
  
  async mostrarMensajeExitoso() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Datos del dispositivo actualizados exitosamente.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  async mostrarError(error: any) {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Ha ocurrido un error al actualizar los datos del dispositivo.',
      buttons: ['Aceptar']
    });
    await alert.present();
  }

}
