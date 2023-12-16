import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-video',
  templateUrl: 'video.page.html',
  styleUrls: ['video.page.scss'],
})
export class VideoPage {
  dvrConfig: { address: string; port: number };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDvrConfig();
  }

  async loadDvrConfig() {
    try {
      // Lee el archivo config.json
      const config = await this.http.get<{ dvrAddress: string; dvrPort: number }>('assets/config.json').toPromise();

      // Almacena los datos en la variable dvrConfig
      this.dvrConfig = {
        address: config.dvrAddress,
        port: config.dvrPort,
      };

      console.log('Configuración de DVR cargada:', this.dvrConfig);
    } catch (error) {
      console.error('Error al cargar la configuración de DVR:', error);
    }
  }

  // Otros métodos y lógica para tu página
}
