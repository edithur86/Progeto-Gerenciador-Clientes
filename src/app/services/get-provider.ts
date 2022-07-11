import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ParametroModel } from '../models/parametro.model';
import { ModelResponseDTO } from '../models/response.dto';
import { NetworkUtil } from '../Utils/network-util';
import { HTTPUtil } from './../Utils/http-util';

export abstract class GetProvider {

    private TAMANHO_PAGINA_DEFAULT = 20;
    public tamanhoPagina: number = this.TAMANHO_PAGINA_DEFAULT;

    private baseURL: string;
    public uri: string;

    constructor(private _httpClient: HttpClient,
        private networkUtil: NetworkUtil) {
        this.baseURL = environment.urlBaseApi;
    }

    abstract getManyPaged(pagina: number, params?: ParametroModel[]);

    abstract getOne(urlParams: string);

    protected async get<T>({ pagina, params, urlParams }:
        { pagina?: number; params?: ParametroModel[]; urlParams?: string } = {}): Promise<ModelResponseDTO<T>> {
        if (!params) {
            params = [];
        }

        return await this._get(params, pagina || 1, urlParams);
    }

    private async _get<T>(params: ParametroModel[], pagina: number, urlParams?: string): Promise<ModelResponseDTO<T>> {
        if (!params.find(tipo => tipo.chave === 'page')) params.push(new ParametroModel('page', pagina));
        if (!params.find(tipo => tipo.chave === 'pageSize')) params.push(new ParametroModel('pageSize', this.tamanhoPagina));

        let response: ModelResponseDTO<T> = { items: [], hasNext: false, length: 0, totvs_messages: [] };

        const httpParams = HTTPUtil.getParams(params);
        let headers = new HttpHeaders();

        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }
        let url = this.baseURL + this.uri;
        if (urlParams) url += urlParams;

        let retornoAPI = await this._httpClient
            .get(url, { headers: headers, params: httpParams })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch((err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            }));

        if (retornoAPI["items"]) {
            if (retornoAPI["items"].length > 0) {
                response.items.push(...retornoAPI["items"])
            } else {
                this.consoleNenhumRetorno(retornoAPI);
            }
        } else {
            if (retornoAPI) {
                response.items.push(<T>retornoAPI);
            } else {
                this.consoleNenhumRetorno(retornoAPI);
            }
        }

        response.hasNext = retornoAPI["hasNext"];

        return response;
    }

    private consoleNenhumRetorno(retornoAPI) {
    }

    public setTamanhoPaginaDefault() {
        this.tamanhoPagina = this.TAMANHO_PAGINA_DEFAULT;
    }

}
