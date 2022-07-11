import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { PoModule } from '@po-ui/ng-components';
import { WebcamModule } from 'ngx-webcam';
import { ClienteGetProvider } from 'src/app/services/cliente/cliente-get-provider';
import { ClientePostProvider } from 'src/app/services/cliente/cliente-post-provider';
import { ClientePutProvider } from 'src/app/services/cliente/cliente-put-provider';
import { NetworkUtil } from './../../Utils/network-util';
import { ClienteEditComponent } from './cliente-edit/cliente-edit.component';
import { ClienteListComponent } from './cliente-list/cliente-list.component';
import { ClienteRoutingModule } from './cliente-routing.module';

@NgModule({
  declarations: [ClienteEditComponent, ClienteListComponent],
  providers: [NetworkUtil, ClienteGetProvider, ClientePostProvider, ClientePutProvider ],
  imports: [
    CommonModule,
    ClienteRoutingModule,
    PoModule,
    FormsModule,
    ReactiveFormsModule,
    WebcamModule,
    GoogleMapsModule
  ]
})
export class ClienteModule { }
