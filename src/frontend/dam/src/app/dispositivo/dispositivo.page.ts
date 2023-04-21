import { Component, OnDestroy, OnInit } from '@angular/core';
import { DispositivoService } from '../services/dispositivo.service';
import { Observable, Subscription, interval } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})

 export class DispositivoPage implements OnInit, OnDestroy  {

  constructor(private dispositivoService: DispositivoService, private actRout: ActivatedRoute) {}

  async ngOnInit() {
    let dispositivos = await this.dispositivoService.getListadoDispositivos()
    console.log(dispositivos)
  }

  ngOnDestroy(): void {}

} 
