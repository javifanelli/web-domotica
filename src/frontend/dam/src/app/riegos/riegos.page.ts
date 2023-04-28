import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Riegos } from './../interfaces/riegos';
import { DispositivoService } from '../services/dispositivo.service';
/* import { FormatoFechaPipe } from '../pipes/formato-fecha.pipe'; */

@Component({
  selector: 'app-riegos',
  templateUrl: './riegos.page.html',
  styleUrls: ['./riegos.page.scss'],
})
export class RiegosPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  constructor(private dispositivoService: DispositivoService) { }
  logRiegos!: Riegos[];
  dispositivoId!: number;

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('dispositivoId') as string;
    console.log("ID: "+deviceId);
    this.dispositivoId = parseInt(deviceId, 10);
    this.dispositivoService.getDeviceById(this.dispositivoId).subscribe(data => {
      const electrovalvulaId = data[0].electrovalvulaId;
      this.dispositivoService.getLogRiegos(electrovalvulaId).subscribe(data => {
        this.logRiegos = data;
      })
    });
  }

}
