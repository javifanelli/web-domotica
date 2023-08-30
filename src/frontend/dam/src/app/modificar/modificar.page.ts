import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DispositivoService } from '../services/dispositivo.service';
import { Dispositivo } from '../interfaces/dispositivo';

@Component({
  selector: 'app-modificar',
  templateUrl: './modificar.page.html',
  styleUrls: ['./modificar.page.scss'],
})
export class ModificarPage implements OnInit {
  dispositivoId!: number;
  dispositivo: Dispositivo = {
    dispositivoId: 0,
    nombre: '',
    ubicacion: '',
    mac: '',
    tipo: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dispositivoService: DispositivoService
  ) {}

  ngOnInit() {
    this.dispositivoId = parseInt(this.route.snapshot.paramMap.get('id') || '0', 10);
    this.cargarDispositivo();
  }

  async cargarDispositivo() {
    try {
      this.dispositivoService.getDeviceById(this.dispositivoId).subscribe(
        dispositivos => {
          if (dispositivos && dispositivos.length > 0) {
            this.dispositivo = dispositivos[0];
          }
        },
        error => {
          console.error('Error al cargar el dispositivo:', error);
        }
      );
    } catch (error) {
      console.error('Error al cargar el dispositivo:', error);
    }
  }
  
  async guardarCambios() {
    try {
      if (this.dispositivo) {
        this.dispositivoService.actualizarDispositivo(this.dispositivo).subscribe(
          () => {
            this.router.navigate(['/home']);
          },
          error => {
            console.error('Error al guardar los cambios:', error);
          }
        );
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    }
  }
  

}
