// clima.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  private baseUrl = 'http://192.168.0.70';

  constructor(private http: HttpClient) {}

  obtenerDatosClima(): Observable<any> {
    const url = `${this.baseUrl}/datosclima`;
    return this.http.get(url);
  }
}
