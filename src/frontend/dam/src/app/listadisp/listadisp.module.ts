import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ListaDispComponent } from './listadisp.component';
import { SubrayaDirective } from '../directives/subraya.directive';

@NgModule({
  declarations: [ListaDispComponent, SubrayaDirective],
  imports: [
    CommonModule,
    IonicModule,
    RouterLink
  ]
})
export class ListadispModule {}
