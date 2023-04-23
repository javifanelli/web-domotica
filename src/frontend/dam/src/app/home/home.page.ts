import { Component } from '@angular/core';
import { HomeService } from '../services/home.service';
import { ListaDispComponent } from '../listadisp/listadisp.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  
})


export class HomePage {
  /* constructor () {} */

  constructor(private _homeService: HomeService) {}


}
