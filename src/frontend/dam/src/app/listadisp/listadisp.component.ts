import { Component, OnInit } from '@angular/core';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-listadisp',
  templateUrl: './listadisp.component.html',
  styleUrls: ['./listadisp.component.scss'],
})
export class ListaDispComponent implements OnInit {
  
  constructor (private deviceService: DispositivoService) {}
  devices?: Dispositivo[];

  ngOnInit(): void {
      this.deviceService.getListaDisp().subscribe(data => {
      this.devices = data;
    })  
  }
}