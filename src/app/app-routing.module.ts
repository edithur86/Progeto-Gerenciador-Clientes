import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  { path: 'login', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'usuario',
    loadChildren: () => import('./components/usuario/usuario.module').then(m => m.UsuarioModule)
  },
  {
    path: 'cliente',
    loadChildren: () => import('./components/cliente/cliente.module').then(m => m.ClienteModule)
  },
 
 
  

  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
