import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'dispositivos/:id',
    loadChildren: () => import('./dispositivo/dispositivo.module').then(m => m.DispositivoModule),
  },
  {
    path: 'medicion/:id',
    loadChildren: () => import('./medicion/medicion.module').then(m => m.MedicionModule)
  },
  {
    path: 'config/:id',
    loadChildren: () => import('./config/config.module').then(m => m.ConfigModule),
  },
  {
    path: 'grafico/:id',
    loadChildren: () => import('./grafico/grafico.module').then(m => m.GraficoPageModule)
  },
  {
    path: 'usuario/:userId',
    loadChildren: () => import('./usuario/usuario.module').then(m => m.UsuarioPageModule)
  },
  {
    path: 'agregar',
    loadChildren: () => import('./agregar/agregar.module').then(m => m.AgregarPageModule)
  },
  {
    path: 'modificar/:id',
    loadChildren: () => import('./modificar/modificar.module').then((m) => m.ModificarPageModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
