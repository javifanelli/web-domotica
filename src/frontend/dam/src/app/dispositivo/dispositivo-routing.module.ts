import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DispositivoPage } from './dispositivo.page';
import { MedicionPage } from '../medicion/medicion.page';
import { RiegosPage } from '../riegos/riegos.page';

const routes: Routes = [
  {
    path: '',
    component: DispositivoPage
  },
  {
    path: ':id',
    component: DispositivoPage
  },
  {path: 'medicion/:id',
  component: MedicionPage

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DispositivoPageRoutingModule {}