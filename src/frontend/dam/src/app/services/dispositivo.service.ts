import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../interfaces/dispositivo';
import { Medicion } from '../interfaces/medicion';

@Injectable({
  providedIn: 'root',
})
export class DispositivoService {
  private URLServer = 'http://192.168.0.70:8000';
  constructor(private _http: HttpClient) {}

  getListaDisp(): Observable<Dispositivo[]> {
    return this._http.get<Dispositivo[]>(this.URLServer + '/dispositivos');
  }

  public getUltMedicion(id: number): Observable<Medicion[]> {
    return this._http.get<Medicion[]>(this.URLServer + '/ultmedicion/' + id);
  }

  public getMediciones(id: number): Observable<Medicion[]> {
    return this._http.get<Medicion[]>(this.URLServer + '/dispositivos/' + id + '/mediciones');
  }

  public getDeviceById(id: number): Observable<Dispositivo[]> {
    return this._http.get<Dispositivo[]>(this.URLServer + '/dispositivos/' + id);
  }

  public deleteDevice(id: number): Observable<any> {
    console.log('Borrando dispositivo con ID:', id);
    return this._http.delete(this.URLServer + '/dispositivos/' + id);
  }
}
