import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { DispositivoService } from '../services/dispositivo.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})


export class HomePage {

  constructor(private _homeService: HomeService) {}

}
