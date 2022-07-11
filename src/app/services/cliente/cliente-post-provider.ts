import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteDTO } from 'src/app/models/cliente/cliente.dto';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { PostProvider } from '../post-provider';

@Injectable({
    providedIn: 'root'
})
export class ClientePostProvider extends PostProvider {

    constructor(private _http: HttpClient,
        private _networkUtil: NetworkUtil) {
        super(_http, _networkUtil);
        this.uri = 'clientes/';
    }

    async post(clientesDTO: ClienteDTO): Promise<ClienteDTO> {
        return await this._post<ClienteDTO>(clientesDTO);
    }

}