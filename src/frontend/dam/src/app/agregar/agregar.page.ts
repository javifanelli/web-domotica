import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.page.html',
  styleUrls: ['./agregar.page.scss'],
})
export class AgregarPage {

  nuevoDispositivo: Dispositivo = {
    dispositivoId: 0,
    nombre: '',
    ubicacion: '',
    mac: '',
    tipo: ''
  };

  constructor(
    private dispositivoService: DispositivoService,
    private router: Router
  ) {}

  agregarDispositivo() {
    this.dispositivoService.agregarDispositivo(this.nuevoDispositivo).subscribe(
      (response) => {
        console.log('Dispositivo agregado correctamente:', response);
        this.router.navigate(['/dispositivos']);
      },
      (error) => {
        console.error('Error al agregar el dispositivo:', error);
      }
    );
  }
}
