import { Component, inject, OnInit, Pipe } from '@angular/core';
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
  public presactual!: number;
  public myChart:any;
  private chartOptions:any;
  private activatedRoute = inject(ActivatedRoute);
  public presion!: number;
  
  constructor(
    private dispositivoService: DispositivoService) {
      setInterval(()=>{
        const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
        if (this.presactual>100)
          {this.presactual=100}
        this.dispositivoService.postMedicion(parseInt(id, 10), (this.presactual + 2).toString());
        this.refrescaChart();
      },20000);
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

  abrirElectrovalvula() {
    this.dispositivoService.abrirElectrovalvula(this.device.electrovalvulaId);
    this.refrescaChart();
  }

  refrescamedicion() {
    const id = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoService.getUltMedicion(parseInt(id, 10)).subscribe(data => {
      this.presactual = parseInt(data[0].valor, 10);
    });
  }

  refrescaChart() {
    this.refrescamedicion();
    this.updateChart();
  }

  updateChart() {
    if (this.presactual>100)
      {this.presactual=100}
    this.myChart.update({series: [{
      name: 'kPA',
      data: [this.presactual],
      tooltip: {
          valueSuffix: ' kPA'
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
          text: 'Sensor N° ' + this.device.dispositivoId
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
  
        tickPixelInterval: 30,
        tickWidth: 2,
        tickPosition: 'inside',
        tickLength: 10,
        tickColor: '#666',
        labels: {
            step: 2,
            rotation: 'auto'
        },
        title: {
            text: 'kPA'
        },
        plotBands: [{
            from: 0,
            to: 10,
            color: '#55BF3B'
        }, {
            from: 10,
            to: 30,
            color: '#DDDF0D'
        }, {
            from: 30,
            to: 100,
            color: '#DF5353'
        }]
    },
  
    series: [{
        name: 'kPA',
        data: [this.presactual],
        tooltip: {
            valueSuffix: ' kPA'
        }
    }]

    };
    this.myChart = Highcharts.chart('highcharts', this.chartOptions );
  }
}