import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Medicion } from '../interfaces/medicion';
import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-medicion',
  templateUrl: './medicion.page.html',
  styleUrls: ['./medicion.page.scss'],
})
export class MedicionPage implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  constructor(private dispositivoService: DispositivoService) { }
  mediciones!: Medicion[];
  dispositivoId!: number;

  ngOnInit() {
    const deviceId = this.activatedRoute.snapshot.paramMap.get('id') as string;
    this.dispositivoId = parseInt(deviceId, 10);
    this.dispositivoService.getMediciones(this.dispositivoId).subscribe(data => {
      this.mediciones = data;
    })
  }

}