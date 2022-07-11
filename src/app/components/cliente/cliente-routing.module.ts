import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClienteEditComponent } from './cliente-edit/cliente-edit.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';


export const clienteRoutes: Routes = [
  {
    path: '', 
    component: ClienteListComponent
  },
  { 
    path: 'new', 
    component: ClienteEditComponent
  },
  {
    path: 'id/:id',
    component: ClienteListComponent
  },
  { 
    path: 'edit/:id', 
    component: ClienteEditComponent
  }
];

  @NgModule({
    imports: [RouterModule.forChild(clienteRoutes)],
    exports: [RouterModule]
  })
  export class ClienteRoutingModule { }
