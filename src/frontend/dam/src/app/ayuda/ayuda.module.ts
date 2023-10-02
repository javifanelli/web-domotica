import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AyudaPage } from './ayuda.page';
import { AyudaPageRoutingModule } from './ayuda-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AyudaPageRoutingModule
  ],
  declarations: [AyudaPage]
})
export class AyudaPageModule {}
