import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ListaDispComponent } from './listadisp.component';
import { SubrayaDirective } from '../directives/subraya.directive';
import { ListadispRoutingModule } from './listadisp-routing.module';

@NgModule({
  declarations: [/* ListaDispComponent, SubrayaDirective */],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ListadispRoutingModule
  ]
})
export class ListadispModule {}