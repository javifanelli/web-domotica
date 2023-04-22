import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-listadisp',
  templateUrl: './listadisp.component.html',
  styleUrls: ['./listadisp.component.scss'],
})
export class ListaDispComponent  implements OnInit {

  constructor (){}
  /* constructor(private deviceService: DeviceService) {}
  devices?: Device[];*/

  ngOnInit(): void {
    /* this.deviceService.getDevices().subscribe(data => {
      this.devices = data;
    })  */

}
}