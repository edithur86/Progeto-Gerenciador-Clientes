import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { from, Observable } from 'rxjs';
import { ModelResponseDTO } from 'src/app/models/response.dto';
import { NetworkUtil } from '../../Utils/network-util';
import { GetProvider } from '../get-provider';
import { ParametroModel } from './../../models/parametro.model';
import { UsuarioDTO } from './../../models/usuario/usuario.dto';

@Injectable({
    providedIn: 'root'
})
export class UsuarioGetProvider extends GetProvider {

    constructor(
        private http: HttpClient,
        private _networkUtil: NetworkUtil
    ) {
        super(http, _networkUtil);
        this.uri = 'usuarios/';
    }

    async getManyPaged(pagina: number, params?: ParametroModel[]): Promise<ModelResponseDTO<UsuarioDTO>> {
        return this.get<UsuarioDTO>({ pagina, params });
    }

    async getForLookup(pagina: number, params?: ParametroModel[]): Promise<ModelResponseDTO<UsuarioDTO>> {
        const urlParams: string = "lookup/all";
        return this.get<UsuarioDTO>({ params, pagina, urlParams });
    }

    async getOne(urlParams: string): Promise<UsuarioDTO> {
        let resposta = await this.get<UsuarioDTO>({ urlParams: urlParams })
        return resposta.items[0];
    }

    async getById(id: string): Promise<UsuarioDTO> {
        return await this.getOne(id);
    }

    async getOneForLookup(valor: string, filterParams): Promise<UsuarioDTO> {        
        try {
            if (!filterParams) {
                return await this.getOne("codigo/" + valor)
            } else {
                return await this.getOne("codigo/" + valor + "/grupoId/" + filterParams);
            }

        } catch (error) {
            this._networkUtil.exibeMsgErroRequisicao(error);
        }

    }

    async getMyUser(): Promise<UsuarioDTO> {
        return await this.getOne("MyUser/")
    }

    getFilteredItems({ filter, page, filterParams }: PoLookupFilteredItemsParams): Observable<any> {
        const params: ParametroModel[] = [
            new ParametroModel('filter', filter || ''),
        ];
        if ((filterParams) && (filterParams.length > 0)) {
            params.push(new ParametroModel('grupoId', filterParams[0].value || ''));
        }
        return from(this.getForLookup(page, params));
    }

    getObjectByValue(value: string, filterParams): Observable<UsuarioDTO> {
        let param: string = "";
        if (filterParams != null && filterParams.length > 0) {
            param = filterParams[0].value;
        }
        return from(this.getOneForLookup(value, param));
    }

    async getUsuarios(ordenarPor: string, pagina: number, params2: ParametroModel[], tamanhoPagina?: number): Promise<ModelResponseDTO<UsuarioDTO>> {
        let params: ParametroModel[] = [];
        if (params2) params = params.concat(params2);
        if (ordenarPor)
            params.push(new ParametroModel('order', ordenarPor));

        if (tamanhoPagina) this.tamanhoPagina = tamanhoPagina;

        return await this.getManyPaged(pagina, params);
    }
}
