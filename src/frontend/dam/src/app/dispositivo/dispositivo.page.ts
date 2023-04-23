import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';

import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-dispositivo',
  templateUrl: './dispositivo.page.html',
  styleUrls: ['./dispositivo.page.scss'],
})

 export class DispositivoPage implements OnInit  {

  constructor(private dispositivoService: DispositivoService, private actRout: ActivatedRoute) {}

  async ngOnInit() {
    let dispositivos = await this.dispositivoService.getListaDisp()
    console.log(dispositivos)
  }

  
 
} 
