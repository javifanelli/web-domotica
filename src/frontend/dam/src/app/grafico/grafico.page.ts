import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ActivatedRoute } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { Medicion } from '../interfaces/medicion';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.page.html',
  styleUrls: ['./grafico.page.scss'],
})
export class GraficoPage implements OnInit {

  dispositivoId!: string;
  mediciones: Medicion[] = [];
  tipo!: string;
  myChart: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private dispositivoService: DispositivoService
  ) {}

  ngOnInit() {
    this.dispositivoId = this.activatedRoute.snapshot.paramMap.get('id') || '0';
    this.dispositivoService.getMediciones(this.dispositivoId).subscribe((data: Medicion[]) => {
      this.mediciones = data;
      this.tipo = data[0].tipo;
      this.renderChart();
    });
  }

  renderChart() {
    this.myChart = Highcharts.chart('chart-container', {
        title: {
          text: this.tipo
          },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Valor'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          pointStart: Date.UTC(2023, 4, 10),
          pointInterval: 24 * 3600 * 1000 // one day
        }
      },
      series: [
        {
            data: this.mediciones.map(medicion => [new Date(medicion.fecha).getTime(), medicion.valor]),
            type: 'line',
            name: 'Data',
            marker: {
            enabled: false
        }
        }
      ],
    });
  }
  
  ngOnDestroy() {
    if (this.myChart) {
      this.myChart.destroy();
      console.log('Chart destroyed');
    }
  }
  
}
