import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListaDispComponent } from './listadisp.component';

const routes: Routes = [
  {
    path: '',
    component: ListaDispComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class ListadispRoutingModule {}