import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { PostProvider } from '../post-provider';
import { UsuarioDTO } from './../../models/usuario/usuario.dto';

@Injectable({
    providedIn: 'root'
})
export class UsuarioPostProvider extends PostProvider {

    constructor(private _http: HttpClient,
        private _networkUtil: NetworkUtil) {
        super(_http, _networkUtil);
        this.uri = 'usuarios/';
    }

    async post(usuario: UsuarioDTO): Promise<UsuarioDTO> {
        return await this._post<UsuarioDTO>(usuario);
    }

}