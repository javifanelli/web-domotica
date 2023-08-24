import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigPage } from './config.page'; // Cambio aquí

const routes: Routes = [
  {
    path: '',
    component: ConfigPage,
  },
  {
    path: ':id',
    component: ConfigPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConfigPageRoutingModule {}
