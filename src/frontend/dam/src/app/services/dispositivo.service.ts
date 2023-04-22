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
  private URLServer = 'http://localhost:8000';
  constructor(private _http: HttpClient) {}

  getListaDisp (): Observable<Dispositivo[]> {
    return this._http.get<Dispositivo[]>(this.URLServer + '/devices');
  }
}
