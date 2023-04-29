import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DispositivoPageRoutingModule } from './dispositivo-routing.module';
import { DispositivoPage } from './dispositivo.page';
import { RouterLink } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DispositivoPageRoutingModule,
    RouterLink
  ],
  declarations: [DispositivoPage]
})

export class DispositivoModule {}