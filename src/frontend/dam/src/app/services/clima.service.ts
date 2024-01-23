import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clima } from '../interfaces/clima';

@Injectable({
  providedIn: 'root',
})
export class ClimaService {
  private URLServer = 'http://192.168.0.70:8000';

  constructor(private _http: HttpClient) {}

  public obtenerDatosClima(): Observable<any> {
    return this._http.get<Clima[]>(this.URLServer + '/datosclima');
  }
}
