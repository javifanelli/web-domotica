// clima.page.ts

import { Component, OnInit } from '@angular/core';
import { ClimaService } from '../services/clima.service';

@Component({
  selector: 'app-clima',
  templateUrl: './clima.page.html',
  styleUrls: ['./clima.page.scss'],
})
export class ClimaPage implements OnInit {
  climaData: any; // Puedes definir una interfaz para los datos del clima si es necesario

  constructor(private climaService: ClimaService) {}

  ngOnInit(): void {
    const locationKey = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY';
    this.climaService.getWeather(locationKey).subscribe((data) => {
      this.climaData = data[0];
    });
  }
}
