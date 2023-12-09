import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ListaDispComponent } from '../listadisp/listadisp.component';
import { ListadispModule } from '../listadisp/listadisp.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ListadispModule
  ],
  declarations: [HomePage, ListaDispComponent]
})

export class HomePageModule {}