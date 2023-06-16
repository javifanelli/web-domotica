import { Component, inject, OnInit, OnDestroy, Pipe } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import * as Highcharts from 'highcharts';
require('highcharts/highcharts-more')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})

export class DispositivoPage implements OnInit  {
  public device!: Dispositivo;
  public dispositivoId!: number;
  public tempactual!: number;
  public myChart:any;
  private chartOptions:any;
  private activatedRoute = inject(ActivatedRoute);
  public presion!: number;
  private updateIntervalId: any;
  
  constructor(
    private dispositivoService: DispositivoService) {
      this.updateIntervalId = setInterval(()=>{
        const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
        this.dispositivoService.postMedicion(parseInt(id, 10), (this.tempactual + 2).toString());
        if (this.tempactual>40)
          {this.tempactual=40}
        this.refrescaChart();
      },30000); // refresca cada 30 segundos
    }

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoId = parseInt(deviceId, 10);
    this.dispositivoService.getDeviceById(this.dispositivoId).subscribe(data => {
      this.device = data[0];
    });
    this.refrescamedicion();
  }

  ionViewDidEnter() {
    this.generarChart();
  }

/*   abrirElectrovalvula() {
    this.dispositivoService.abrirElectrovalvula(this.device.electrovalvulaId);
    this.refrescaChart();
  } */

  refrescamedicion() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoService.getUltMedicion(parseInt(id, 10)).subscribe(data => {
      this.tempactual = parseInt(data[0].valor, 10);
    });
  }

  refrescaChart() {
    this.refrescamedicion();
    this.updateChart();
  }

  updateChart() {
    if (this.tempactual>40)
      {this.tempactual=40}
    this.myChart.update({series: [{
      name: 'Temperatura actual',
      data: [this.tempactual],
      tooltip: {
          valueSuffix: ' °C'
      }
    }]});
  }

  generarChart() {
    this.chartOptions={
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false
        }
        ,title: {
          text: 'Sensor ' + this.device.dispositivoId + ' - ' + this.device.ubicacion
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
            to: 15,
            color: '#3339FF'
        }, 
        {    
            from: 15,
            to: 20,
            color: '#DDDF0D'
        },
           {
            from: 20,
            to: 25,
            color: '#55BF3B'
        }, 
           {
          from: 25,
          to: 30,
          color: '#DDDF0D'
          },
           {
            from: 30,
            to: 40,
            color: '#DF5353'
        }]
    },
    // colores: verde #55BF3B, amarillo #DDDF0D, rojo #DF5353, azul #3339FF
  
    series: [{
        name: 'Temperatura actual',
        data: [this.tempactual],
        tooltip: {
            valueSuffix: ' °C'
        }
    }]

    };
    this.myChart = Highcharts.chart('highcharts', this.chartOptions );
  }

  ngOnDestroy() {
    clearInterval(this.updateIntervalId);
    if (this.myChart) {
      this.myChart.destroy();
      console.log("chart destruido");
    }
  }

}