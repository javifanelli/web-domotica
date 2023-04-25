import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RiegosPage } from './riegos.page';

const routes: Routes = [
  {
    path: '/riegos',
    component: RiegosPage
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RiegosRoutingModule { }
