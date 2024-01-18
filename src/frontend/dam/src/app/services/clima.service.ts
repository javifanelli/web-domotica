// clima.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';  // Asegúrate de importar 'of' desde 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  private apiUrl = 'https://developer.accuweather.com/accuweather-current-conditions-api/apis/get/currentconditions/v1/';
  private apiKey = 'y8xWsCFyDQQfjZ7BeoAWJbYCo7Y3tqWY';
  private ubicacionKey = '2920';

  constructor(private http: HttpClient) {}

  getWeather(locationKey: string): Observable<any> {
    const url = `${this.apiUrl}${locationKey}?apikey=${this.apiKey}`;
    return this.http.get(url);
  }

  getLocationKey(ubicacion: string): Observable<any> {
    // Realiza la lógica para obtener la clave de ubicación según tu implementación
    // Este método podría hacer una llamada a un servicio propio o a la API de AccuWeather para obtener la clave
    // En este ejemplo, simplemente devuelvo una clave predefinida ('2920') para ilustrar el concepto.
    return of('2920'); // Reemplaza con tu lógica real
  }
}
