import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit, OnDestroy {
  public device!: Dispositivo;
  public dispositivoId!: number;
  public setPoint!: number;
  public tipo!: string;
  public nuevoSetPoint!: number;
  public hon!: number;
  public mon!: number;
  public hoff!: number;
  public moff!: number;
  public horaEncendido: string = '';
  public minutoEncendido: string = '';
  public horaApagado: string = '';
  public minutoApagado: string = '';
  private activatedRoute: ActivatedRoute;
  private updateIntervalId: any;

  constructor(
    private dispositivoService: DispositivoService,
    private _activatedRoute: ActivatedRoute,
    private alertController: AlertController
  ) {
    this.activatedRoute = _activatedRoute;
    this.updateIntervalId = setInterval(() => {
      const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    }, 5000); // refresca cada 5 segundos
  }

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoId = parseInt(deviceId, 10);
    this.dispositivoService.getDeviceById(this.dispositivoId).subscribe((data) => {
      this.device = data[0];
      this.tipo = data[0].tipo;
    });
    this.leerdatos();
  }
  
  leerdatos() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoService.getUltMedicion(parseInt(id, 10)).subscribe((data) => {
      this.setPoint = data[0].set_point;
      this.nuevoSetPoint = this.setPoint;
      this.hon = data[0].hon;
      this.horaEncendido = this.hon.toString();
      this.mon = data[0].mon;
      this.minutoEncendido = this.mon.toString();
      this.hoff = data[0].hoff;
      this.horaApagado = this.hoff.toString();
      this.moff = data[0].moff;
      this.minutoApagado = this.moff.toString();
    });
  }

  actualizarNuevoSetPoint() {
    if (this.nuevoSetPoint >= 0 && this.nuevoSetPoint <= 100) {
      this.setPoint = this.nuevoSetPoint;
      console.log('Nuevo set point actualizado:', this.setPoint);
    } else {
      console.log('Nuevo set point fuera de rango');
    }
  }

  enviarDatos() {
    const datos = {
      nuevoSetPoint: this.nuevoSetPoint,
      horaEncendido: this.horaEncendido,
      minutoEncendido: this.minutoEncendido,
      horaApagado: this.horaApagado,
      minutoApagado: this.minutoApagado,
      tipo: this.tipo
    };

    this.dispositivoService.enviarDatos(datos).subscribe(
      (response) => {
        console.log('Datos enviados correctamente:', response);
      },
      (error) => {
        console.error('Error al enviar los datos:', error);
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.updateIntervalId);
  }
}