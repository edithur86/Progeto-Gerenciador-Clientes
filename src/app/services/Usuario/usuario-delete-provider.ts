import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { DeleteProvider } from '../delete-provider';

@Injectable({
    providedIn: 'root'
})
export class UsuarioDeleteProvider extends DeleteProvider {

    constructor(private _http: HttpClient,
        private _networkUtil: NetworkUtil) {
        super(_http, _networkUtil);
        this.uri = 'usuarios/';
    }    

    async deleteById(id: string) {
        return await this._delete(id);
    }

}