import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Riegos } from './../interfaces/riegos';
import { DispositivoService } from '../services/dispositivo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-riegos',
  templateUrl: './riegos.page.html',
  styleUrls: ['./riegos.page.scss'],
})
export class RiegosPage implements OnInit, OnDestroy {

  private activatedRoute = inject(ActivatedRoute);
  private subscription: Subscription = new Subscription();

  constructor(private dispositivoService: DispositivoService) { }
  logRiegos!: Riegos[];
  dispositivoId!: number;

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('dispositivoId') as string;
    this.dispositivoId = parseInt(deviceId, 10);
    this.subscription = this.dispositivoService.getDeviceById(this.dispositivoId).subscribe(data => {
      const electrovalvulaId = data[0].electrovalvulaId;
      this.subscription = this.dispositivoService.getLogRiegos(electrovalvulaId).subscribe(data => {
        this.logRiegos = data;
      })
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}