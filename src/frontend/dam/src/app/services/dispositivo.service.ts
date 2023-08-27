import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Dispositivo } from '../interfaces/dispositivo';
import { Medicion } from '../interfaces/medicion';
import { Usuario } from '../interfaces/usuario';

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
    return this._http.delete(this.URLServer + '/dispositivos/' + id);
  }

  public enviarDatos(datos: any): Observable<any> {
    return this._http.post(this.URLServer + '/enviardatos', datos);
  }

  public borrarTabla(id: number): Observable<any> {
    return this._http.delete(this.URLServer + '/borrartabla/' + id);
  }

  public getUser(user: string): Observable<Usuario> {
    return this._http.get<Usuario>(this.URLServer + '/usuario/' + user);
  }

  public updateUser(user: string, userData: Usuario): Observable<any> {
    const url = this.URLServer + '/usuario/' + user;
    return this._http.put(url, userData);
  }

}