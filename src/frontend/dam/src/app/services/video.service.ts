import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Video } from '../interfaces/video';

@Injectable({
  providedIn: 'root',
})
export class VideoService {
  private URLServer = 'http://192.168.0.70:8000';

  constructor(private _http: HttpClient) {}

  getVideoData(): Observable<Video> {
    return this._http.get<Video>('../assets/video.json').pipe(
      tap((data) => {
        console.log('Datos del archivo json en el servicio:', data);
      })
    );
  }
}