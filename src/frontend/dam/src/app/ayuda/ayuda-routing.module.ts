import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AyudaPage } from './ayuda.page';

const routes: Routes = [
  {
    path: '',
    component: AyudaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AyudaPageRoutingModule {}
