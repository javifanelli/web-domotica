import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { AlertController } from '@ionic/angular';
import * as Highcharts from 'highcharts';
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})
export class DispositivoPage implements OnInit, OnDestroy {
  public device!: Dispositivo;
  public dispositivoId!: string;
  public valoractual!: number;
  public setPoint!: number;
  public tipo!: string;
  public ultfecha: any;
  public salida!: number;
  public estadoConexion!: string;
  public modo!: string;
  public alarma!: number;
  public act_al!: number;
  public myChart: any;
  private chartOptions: any;
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
      this.refrescaChart();
    }, 5000); // refresca cada 5 segundos
  }

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoId = deviceId;
    this.dispositivoService.getDeviceById(this.dispositivoId).subscribe((data) => {
      this.device = data[0];
      this.tipo = data[0].tipo;
    });
    this.refrescamedicion();
  }

  ionViewDidEnter() {
    setTimeout(() => {
      if (this.tipo === 'Temperatura') {
        this.generarChartTemp();
      } else if (this.tipo === 'Luz dimmer') {
        this.generarChartLuzDimmer();
      }
    }, 100);
  }
  
  refrescamedicion() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoService.getUltMedicion(id).subscribe((data) => {
      this.valoractual = parseInt(data[0].valor, 10);
      this.ultfecha = new Date(data[0].fecha);
      this.setPoint = data[0].set_point;
      this.salida = data[0].salida;
      this.modo = data[0].modo;
      this.alarma = this.device.alarma;
      this.act_al = this.device.act_al;
      this.updateEstadoConexion();
    });
  }

  refrescaChart() {
    this.refrescamedicion();
    this.updateChart();
  }

  updateChart() {
    if (this.tipo === 'Temperatura') {
      if (this.valoractual>40)
        {this.valoractual=40}
      this.myChart.update({series: [{
        name: 'Temperatura actual',
        data: [this.valoractual],
        tooltip: {
          valueSuffix: ' ºC'
        }
    }]});
    }
    if (this.tipo === 'Luz dimmer') {
      if (this.valoractual>100)
        {this.valoractual=100}
      this.myChart.update({series: [{
        name: 'Salida actual',
        data: [this.valoractual],
        tooltip: {
          valueSuffix: ' %'
        }
    }]});
    }
  }

  generarChartTemp() {
    this.chartOptions={
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
        }
        ,title: {
          text: 'Dispositivo ' + this.device.dispositivoId + ' - ' + this.device.ubicacion
        }
        ,credits:{enabled:false}
        ,pane: {
            startAngle: -150,
            endAngle: 150
        } 
      ,yAxis: {
        min: 0,
        max: 40,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 10,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 5,
            rotation: 'auto'
        },
        title: {
            text: '°C'
        },
        plotBands: [{
            from: 0,
            to: 10,
            color: '#3339FF'
        }, 
        {    
            from: 10,
            to: 18,
            color: '#DDDF0D'
        },
           {
            from: 18,
            to: 28,
            color: '#55BF3B'
        }, 
           {
            from: 28,
            to: 40,
            color: '#DF5353'
        }]
    },
    // colores: verde #55BF3B, amarillo #DDDF0D, rojo #DF5353, azul #3339FF
    series: [{
        name: 'Temperatura actual',
        data: [this.valoractual],
        tooltip: {
            valueSuffix: ' °C'
        }
    }]
    };
    this.myChart = Highcharts.chart('highcharts', this.chartOptions );
  }

  generarChartLuzDimmer() {
    this.chartOptions={
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
        }
        ,title: {
          text: 'Dispositivo ' + this.device.dispositivoId + ' - ' + this.device.ubicacion
        }
        ,credits:{enabled:false}
        ,pane: {
            startAngle: -150,
            endAngle: 150
        } 
      ,yAxis: {
        min: 0,
        max: 100,
        minorTickInterval: 'auto',
        minorTickWidth: 1,
        minorTickLength: 10,
        minorTickPosition: 'inside',
        minorTickColor: '#666',
        tickPixelInterval: 10,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 5,
            rotation: 'auto'
        },
        title: {
            text: '%'
        },
        plotBands: [{
            from: 0,
            to: 35,
            color: '#55BF3B'
        }, 
        {    
            from: 35,
            to: 70,
            color: '#DDDF0D'
        },
           {
            from: 70,
            to: 100,
            color: '#DF5353'
        }]
    },
    // colores: verde #55BF3B, amarillo #DDDF0D, rojo #DF5353, azul #3339FF
    series: [{
        name: 'Salida actual',
        data: [this.valoractual],
        tooltip: {
            valueSuffix: ' %'
        }
    }]
    };
    this.myChart = Highcharts.chart('highcharts', this.chartOptions );
  }

  updateEstadoConexion() {
    const cincoMinutos = 5 * 60 * 1000; // 5 minutos en milisegundos
    const tiempoActual = new Date();
    if (tiempoActual.getTime() - this.ultfecha.getTime() > cincoMinutos) {
      this.estadoConexion = 'Offline';
    } else {
      this.estadoConexion = 'Online';
    }
  }

  ngOnDestroy() {
    clearInterval(this.updateIntervalId);
    if (this.myChart) {
      this.myChart.destroy();
      console.log('Chart destroyed');
    }
  }
}