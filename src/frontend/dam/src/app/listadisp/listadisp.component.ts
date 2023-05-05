import { Component, OnInit, OnDestroy } from '@angular/core';
import { Dispositivo } from '../interfaces/dispositivo';
import { DispositivoService } from '../services/dispositivo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-listadisp',
  templateUrl: './listadisp.component.html',
  styleUrls: ['./listadisp.component.scss'],
})
export class ListaDispComponent implements OnInit, OnDestroy {
  
  constructor (private deviceService: DispositivoService) {}
  devices?: Dispositivo[];
  subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.deviceService.getListaDisp().subscribe(data => {
      this.devices = data;
    })  
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
