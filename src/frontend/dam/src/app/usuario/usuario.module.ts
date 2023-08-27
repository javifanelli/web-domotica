import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { UsuarioPageRoutingModule } from './usuario-routing.module';
import { UsuarioPage } from './usuario.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsuarioPageRoutingModule
  ],
  declarations: [UsuarioPage]
})
export class UsuarioPageModule {}
