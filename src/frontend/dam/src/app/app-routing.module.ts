import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [
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
    loadChildren: () =>
      import('./dispositivo/dispositivo.module').then((m) => m.DispositivoPageModule),
  },
  
  /* {
  path: 'mediciones/:id',
  loadChildren: () => import('./mediciones/mediciones.page').then( m => m.MedicionesPage)
  }, */
  
  {
  path: 'riegos/:deviceId',
  loadChildren: () => import('./riegos/riegos.module').then( m => m.RiegosModule)
  },
  
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {}