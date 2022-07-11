import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteDTO } from 'src/app/models/cliente/cliente.dto';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { PutProvider } from '../put-provider';

@Injectable({
    providedIn: 'root'
})
export class ClientePutProvider extends PutProvider {

    constructor(private _http: HttpClient,
        private _networkUtil: NetworkUtil) {
        super(_http, _networkUtil);
        this.uri = 'clientes/';
    }

    async put(id: string, cliente: ClienteDTO): Promise<ClienteDTO> {
        return await this._put<ClienteDTO>(id, cliente);
    }
  
}