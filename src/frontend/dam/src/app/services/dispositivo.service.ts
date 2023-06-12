import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../interfaces/dispositivo';
import { Medicion } from '../interfaces/medicion';
import { Riegos } from '../interfaces/riegos';

@Injectable({
  providedIn: 'root'
})

export class DispositivoService {
  private URLServer = 'http://192.168.0.70:8000';
  constructor(private _http: HttpClient) {}

  getListaDisp (): Observable<Dispositivo[]> {
    return this._http.get<Dispositivo[]>(this.URLServer + '/dispositivos');
  }

  public getUltMedicion(id: number): Observable<Medicion[]> {
    return this._http.get<Medicion[]>(this.URLServer + '/ultmedicion/'+id);
  }

  postLogRiegos(deviceId: number) {
    let logRiego: Riegos = {
      apertura: '1',
      fecha: (new Date()).toISOString().split('T')[0],
      electrovalvulaId: deviceId
    }
    this._http.post(this.URLServer+'/logriegos',logRiego)
      .subscribe((res) => {
        console.log(res);
      });
  }

  public postMedicion(dispositivoId: number, valorMedicion: string) {
    let medicion: Medicion = {
      fecha: (new Date()).toISOString().split('T')[0],
      valor: valorMedicion,
      dispositivoId: dispositivoId
    }
    this._http.post(this.URLServer+'/medicion',medicion)
      .subscribe((res) => {
        console.log(res);
      });
  }

  public getMediciones(id: number): Observable<Medicion[]> {
    return this._http.get<Medicion[]>(this.URLServer+'/dispositivos/'+id+'/mediciones');
  }

  public getLogRiegos(electrovalvulaId: number): Observable<Riegos[]> {
    return this._http.get<Riegos[]>(this.URLServer+'/riegos/'+electrovalvulaId);
  }

  public abrirElectrovalvula(dispositivoId: number) {
    this.postLogRiegos(dispositivoId);
    this.postMedicion(dispositivoId, '0');
  }

  public getDeviceById(id: number): Observable<Dispositivo[]> {
    return this._http.get<Dispositivo[]>(this.URLServer+'/dispositivos/'+id);
  }

}