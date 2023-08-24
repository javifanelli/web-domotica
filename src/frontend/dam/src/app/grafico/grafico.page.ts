import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-grafico',
  templateUrl: './grafico.page.html',
  styleUrls: ['./grafico.page.scss'],
})
export class GraficoPage implements OnInit {

  dispositivoId!: number;

  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    const dispositivoIdParam = this.activatedRoute.snapshot.paramMap.get('dispositivoId');
if (dispositivoIdParam !== null) {
  this.dispositivoId = parseInt(dispositivoIdParam, 10);
}
    this.renderChart();
  }

  renderChart() {
    Highcharts.chart('chart-container', {
      title: {
        text: 'Continuous trend line chart'
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'Value'
        }
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          pointStart: Date.UTC(2015, 0, 1),
          pointInterval: 24 * 3600 * 1000 // one day
        }
      },
      series: [{
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        type: 'line',
        name: 'Data',
        marker: {
          enabled: false
        }
      }]
    });
  }
}
