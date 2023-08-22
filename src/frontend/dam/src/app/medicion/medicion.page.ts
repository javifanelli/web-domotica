import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Medicion } from '../interfaces/medicion';
import { DispositivoService } from '../services/dispositivo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.page.html',
  styleUrls: ['./medicion.page.scss'],
})
export class MedicionPage implements OnInit, OnDestroy {

  constructor(
    private activatedRoute: ActivatedRoute,
    private dispositivoService: DispositivoService
  ) {}

  mediciones!: Medicion[];
  dispositivoId!: number;
  tipo!: string;
  private subscription: Subscription = new Subscription();

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoId = parseInt(deviceId, 10);
    this.subscription = this.dispositivoService.getMediciones(this.dispositivoId).subscribe(data => {
      this.mediciones = data;
      if (data.length > 0) {
        this.tipo = data[0].tipo;
      }
    });
    
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}