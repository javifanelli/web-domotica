import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, finalize } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-video',
  templateUrl: 'video.page.html',
  styleUrls: ['video.page.scss'],
})
export class VideoPage {
  dvrConfig: { address: string; port: number };

  constructor(private http: HttpClient) {
    this.dvrConfig = {
      address: 'defaultAddress',
      port: 8080,
    };
  }

  ngOnInit() {
    this.loadDvrConfig();
  }

  loadDvrConfig() {
    this.http.get<{ dvrAddress: string; dvrPort: number }>('../assets/video.json')
      .pipe(
        catchError(error => {
          console.error('Error al cargar la configuración de DVR:', error);
          return of(null);
        }),
        finalize(() => {
          // Código que se ejecuta tanto en caso de éxito como de error
        })
      )
      .subscribe(config => {
        if (config) {
          this.dvrConfig = {
            address: config.dvrAddress,
            port: config.dvrPort,
          };
          console.log('Configuración de DVR cargada:', this.dvrConfig);
        }
      });
  }

}
