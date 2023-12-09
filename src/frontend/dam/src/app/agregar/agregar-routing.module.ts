import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AgregarPage } from './agregar.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AgregarPageRoutingModule {}
