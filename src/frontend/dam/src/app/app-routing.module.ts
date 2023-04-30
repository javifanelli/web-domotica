import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  },
  
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  
  {
    path: 'dispositivos/:id',
    loadChildren: () => import('./dispositivo/dispositivo.module').then((m) => m.DispositivoModule),
  },
  
  {
    path: 'riegos/:dispositivoId',
    loadChildren: () => import('./riegos/riegos.module').then( m => m.RiegosModule)
  },
  
  {
    path: 'medicion/:id',
    loadChildren: () => import('./medicion/medicion.module').then( m => m.MedicionModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}