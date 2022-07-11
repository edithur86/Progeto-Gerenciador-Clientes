import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoLookupFilteredItemsParams } from '@po-ui/ng-components';
import { from, Observable } from 'rxjs';
import { ClienteDTO } from 'src/app/models/cliente/cliente.dto';
import { ParametroModel } from 'src/app/models/parametro.model';
import { ModelResponseDTO } from 'src/app/models/response.dto';
import { NetworkUtil } from '../../Utils/network-util';
import { GetProvider } from '../get-provider';

@Injectable({
    providedIn: 'root'
})
export class ClienteGetProvider extends GetProvider {

    constructor(
        private http: HttpClient,
        private _networkUtil: NetworkUtil
    ) {
        super(http, _networkUtil);
        this.uri = 'clientes/';
    }

    async getManyPaged(pagina: number, params?: ParametroModel[]): Promise<ModelResponseDTO<ClienteDTO>> {
        return this.get<ClienteDTO>({ pagina, params });
    }

    async getOne(urlParams: string): Promise<ClienteDTO> {
        let resposta = await this.get<ClienteDTO>({ urlParams: urlParams })
        return resposta.items[0];
    }

    async getById(id: string): Promise<ClienteDTO> {
        return await this.getOne(id);
    }

   /*  async getByCnpjCpf(cnpjCpf: string): Promise<ClienteDTO> {
        return await this.getOne(cnpjCpf);
    } */

    async getByCnpjCpf(cnpjCpf: string): Promise<ClienteDTO> {
        return await this.getOne("cnpjCpf/" + cnpjCpf)
    }

    async getOneForLookup(valor: string): Promise<ClienteDTO> {
        return await this.getOne("codigo/" + valor)
    }
    async getForLookup(pagina: number, params?: ParametroModel[]): Promise<ModelResponseDTO<ClienteDTO>> {
        const urlParams: string = "lookup/all";
        return this.get<ClienteDTO>({ params, pagina, urlParams });
    }

    async getClientes(ordenarPor: string, pagina: number, params2: ParametroModel[], tamanhoPagina?: number): Promise<ModelResponseDTO<ClienteDTO>> {
        let params: ParametroModel[] = [];
        if (params2) params = params.concat(params2);
        if (ordenarPor)
            params.push(new ParametroModel('order', ordenarPor));

        if (tamanhoPagina) this.tamanhoPagina = tamanhoPagina;

        return await this.getManyPaged(pagina, params);
    }

    getFilteredItems(filteredParams: PoLookupFilteredItemsParams): Observable<any> {
        this.tamanhoPagina = filteredParams.pageSize;
        const params: ParametroModel[] = [
            new ParametroModel('ativo', "true" || ''),
            new ParametroModel('filter', filteredParams.filter || '')
        ];

        return from(this.getForLookup(filteredParams.page, params));
    }

    getObjectByValue(value: string): Observable<ClienteDTO> {
        return from(this.getOneForLookup(value.toString().trim()));
    }
}
