import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ListaDispComponent } from './listadisp.component';
import { SubrayaDirective } from '../directives/subraya.directive';
import { ListadispRoutingModule } from './listadisp-routing.module';

@NgModule({
  declarations: [ListaDispComponent, SubrayaDirective],
  imports: [
    CommonModule,
    IonicModule,
    ListadispRoutingModule
  ]
})
export class ListadispModule {}