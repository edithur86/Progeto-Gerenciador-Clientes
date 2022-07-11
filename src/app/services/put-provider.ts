import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { NetworkUtil } from '../Utils/network-util';

export abstract class PutProvider {

    private baseURL: string;
    public uri: string;


    constructor(private http: HttpClient,
        private networkUtil: NetworkUtil) {
        this.baseURL = environment.urlBaseApi;
    }

    abstract put(id: string, body: any);

    protected async _put<T>(id: string, body?: T): Promise<T> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }
        const resposta: T = await this.http.put<T>(this.baseURL + this.uri + id, body, { headers: headers })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch(err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            });

        return resposta;
    }

    protected async _putFinanceiroTipo<T>(id: string, ordemDestino: Number, body?: T): Promise<T> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }
        const resposta: T = await this.http.put<T>(this.baseURL + this.uri + 'ordenar/' + id + '/ordemDestino/' + ordemDestino, body, { headers: headers })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch(err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            });

        return resposta;
    }

    protected async _putOrdemServico<T>(id: string, statusAtual: string, body?: T): Promise<T> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }
        const resposta: T = await this.http.put<T>(this.baseURL + this.uri + 'ordemServico/' + id + '/statusAtual/' + statusAtual, body, { headers: headers })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch(err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            });

        return resposta;
    }

    protected async _putList<T>(body?: T[]): Promise<T[]> {
        let headers: HttpHeaders = new HttpHeaders();
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }
        const resposta: T[] = await this.http.put<T[]>(this.baseURL + this.uri, body, { headers: headers })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch(err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            });

        return resposta;
    }
}
