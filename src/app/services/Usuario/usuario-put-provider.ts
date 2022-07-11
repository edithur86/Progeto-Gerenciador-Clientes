import { UsuarioUpdateSenhaDTO } from './../../models/usuario/usuario-update-senha.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { PutProvider } from '../put-provider';
import { UsuarioDTO } from './../../models/usuario/usuario.dto';

@Injectable({
    providedIn: 'root'
})
export class UsuarioPutProvider extends PutProvider {

    constructor(private _http: HttpClient,
        private _networkUtil: NetworkUtil) {
        super(_http, _networkUtil);
        this.uri = 'usuarios/';
    }

    async put(id: string, entidade: UsuarioDTO): Promise<UsuarioDTO> {
        this.uri = 'usuarios/';
        return await this._put<UsuarioDTO>(id, entidade);
    }

    async putUpdateSenha(usuario: UsuarioUpdateSenhaDTO): Promise<UsuarioUpdateSenhaDTO> {
        this.uri = 'usuarios/passwordUpdate';
        return await this._put<UsuarioUpdateSenhaDTO>("", usuario);
    }

}