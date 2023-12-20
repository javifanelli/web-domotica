import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video',
  templateUrl: 'video.page.html',
  styleUrls: ['video.page.scss'],
})
export class VideoPage implements OnInit {
  dvrConfig: { dvrAddress: string; dvrPort: number };

  constructor(private videoService: VideoService, private sanitizer: DomSanitizer) {
    this.dvrConfig = {
      dvrAddress: 'defaultAddress',
      dvrPort: 8080,
    };
  }

  ngOnInit() {
    this.loadDvrConfig();
  }
  
  iframeLoaded(event: Event) {
    console.log('iframe cargado con éxito', event);
  }
  
  iframeError(event: Event) {
    console.error('Error al cargar el iframe', event);
  }
  
  getSafeUrl(): SafeResourceUrl {
    const url = `http://${this.dvrConfig.dvrAddress}:${this.dvrConfig.dvrPort}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  async loadDvrConfig() {
    this.videoService.getVideoData()
      .pipe(
        catchError(error => {
          console.error('Error al cargar la configuración de DVR:', error);
          return of(null);
        }),
        finalize(() => {
          alert("Por favor configure correctamente la DVR");
        })
      )
      .subscribe({
        next: (config: { dvrAddress: string; dvrPort: number } | null) => {
          if (config) {
            this.dvrConfig = {
              dvrAddress: config.dvrAddress,
              dvrPort: config.dvrPort,
            };
            console.log('Configuración de DVR cargada:', this.dvrConfig);
          }
        },
        error: (error: any) => {
          console.error('Error al suscribirse al observable:', error);
        }
      } as any);
  }
}
