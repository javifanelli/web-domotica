import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { GraficoPage } from './grafico.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: GraficoPage
      }
    ])
  ],
  declarations: [GraficoPage]
})
export class GraficoPageModule {}
