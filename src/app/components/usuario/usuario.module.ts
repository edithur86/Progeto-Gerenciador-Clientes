import { UsuarioMudarSenhaComponent } from './usuario-mudar-senha/usuario-mudar-senha.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoModule } from '@po-ui/ng-components';
import { UsuarioEditComponent } from './usuario-edit/usuario-edit.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioRoutingModule } from './usuario-routing.module';



@NgModule({
  declarations: [UsuarioEditComponent, UsuarioListComponent, UsuarioMudarSenhaComponent],
  providers: [],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    PoModule,
    FormsModule,
    ReactiveFormsModule
    
  ]
})
export class UsuarioModule { }
