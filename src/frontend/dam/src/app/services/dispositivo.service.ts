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

  public getUltMedicion(id: string): Observable<Medicion[]> {
    return this._http.get<Medicion[]>(this.URLServer + '/ultmedicion/' + id);
  }

  public getMediciones(id: string): Observable<Medicion[]> {
    return this._http.get<Medicion[]>(this.URLServer + '/dispositivos/' + id + '/mediciones');
  }

  public getDeviceById(id: string): Observable<Dispositivo[]> {
    return this._http.get<Dispositivo[]>(this.URLServer + '/dispositivos/' + id);
  }

  public deleteDevice(id: string): Observable<any> {
    return this._http.delete(this.URLServer + '/dispositivos/' + id);
  }

  public enviarDatos(datos: any): Observable<any> {
    return this._http.post(this.URLServer + '/enviardatos', datos);
  }

  public borrarTabla(id: string): Observable<any> {
    return this._http.delete(this.URLServer + '/borrartabla/' + id);
  }

  public getUser(userId: number): Observable<Usuario> {
    return this._http.get<Usuario>(this.URLServer + '/usuario/' + userId);
  }

  public updateUser(userId: number, userData: Usuario): Observable<any> {
    return this._http.put(this.URLServer + '/usuario/' + userId, userData)
  }

  public agregarDispositivo(dispositivo: Dispositivo): Observable<any> {
    return this._http.post(this.URLServer + '/agregar/', dispositivo);
  }

  public actualizarDispositivo(dispositivo: Dispositivo): Observable<any> {
    return this._http.put(this.URLServer + '/modificar/' + dispositivo.dispositivoId, dispositivo);
  }

}