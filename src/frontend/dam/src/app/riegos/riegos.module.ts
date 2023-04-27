import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RiegosPage } from './riegos.page';
import { RiegosRoutingModule } from './riegos-routing.module';

@NgModule({
  declarations: [RiegosPage],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RiegosRoutingModule
  ],
})
export class RiegosModule {}