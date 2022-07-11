import { UsuarioMudarSenhaComponent } from './usuario-mudar-senha/usuario-mudar-senha.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';



export const usuarioRoutes: Routes = [
  {
    path: '', 
    component: UsuarioListComponent
  },
  {
    path: 'updateSenha/:id', 
    component: UsuarioMudarSenhaComponent
  },
  { 
    path: 'new', 
    component: UsuarioEditComponent
  },
  { 
    path: 'edit/:id', 
    component: UsuarioEditComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(usuarioRoutes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }
