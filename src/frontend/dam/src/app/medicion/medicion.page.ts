import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Medicion } from '../interfaces/medicion';
import { DispositivoService } from '../services/dispositivo.service';
import { AlertController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.page.html',
  styleUrls: ['./medicion.page.scss'],
})
export class MedicionPage implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private dispositivoService: DispositivoService,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  mediciones!: Medicion[];
  dispositivoId!: number;
  tipo!: string;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoId = parseInt(deviceId, 10);
    this.subscription = this.dispositivoService.getMediciones(this.dispositivoId).subscribe(data => {
      this.mediciones = data;
      if (data.length > 0) {
        this.tipo = data[0].tipo;
      }
    });
  }

  async borrarTabla(id: number) {
    console.log("Vamos a borrar el dispositivo:", id);
    const confirmar = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: '¿Estás seguro de que deseas borrar la tabla de mediciones?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Borrar',
          handler: async () => {
            try {
              await this.dispositivoService.borrarTabla(id).toPromise();
              console.log('Tabla de mediciones borrada correctamente.');
              // Redirigir al usuario a la página anterior o a la página de inicio
              this.navCtrl.back(); // Puede variar según tu estructura de navegación
            } catch (error) {
              console.error('Error al borrar la tabla de mediciones:', error);
            }
          }
        }
      ]
    });
  
    await confirmar.present();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}