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
  public spsend!: number;
  public horaEncendido!: number;
  public minutoEncendido!: number;
  public horaApagado!: number;
  public minutoApagado!: number;
  public modo!: string;
  public mododisp!: string;
  public salida!: number;
  public outsend!: number;
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
      this.salida = data[0].salida;
      this.outsend = this.salida;
      this.setPoint = data[0].set_point;
      this.spsend = this.setPoint;
      this.hon = data[0].hon;
      this.horaEncendido = this.hon;
      this.mon = data[0].mon;
      this.minutoEncendido = this.mon;
      this.hoff = data[0].hoff;
      this.horaApagado = this.hoff;
      this.moff = data[0].moff;
      this.minutoApagado = this.moff;
      this.modo = data[0].modo;
      this.mododisp = this.modo;
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
      nuevoSetPoint: Number(this.spsend),
      horaEncendido: Number(this.horaEncendido),
      minutoEncendido: Number(this.minutoEncendido),
      horaApagado: Number(this.horaApagado),
      minutoApagado: Number(this.minutoApagado),
      dispositivoId: Number(this.dispositivoId),
      mododisp: this.mododisp,
      tipo: this.tipo,
      salida: Number(this.outsend),
    };
    this.dispositivoService.enviarDatos(datos).subscribe(
      (response) => {
        console.log('Datos enviados correctamente:', response);
        console.log("Datos enviados:", datos);
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