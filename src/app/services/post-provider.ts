import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { NetworkUtil } from '../Utils/network-util';


export abstract class PostProvider {

    private baseURL: string;
    public uri: string;

    constructor(private http: HttpClient,
        private networkUtil: NetworkUtil) {
        this.baseURL = environment.urlBaseApi;
    }

    abstract post(body: any);

    protected async _post<T>(body: any, url?: string): Promise<T> {

        let headers: HttpHeaders = new HttpHeaders();
        let urlRequest: string = "";
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }
        if (url != null && url.trim()) {
            urlRequest = this.baseURL + this.uri + url;
        } else {
            urlRequest = this.baseURL + this.uri;
        }
        const resposta: T = await this.http.post<T>(urlRequest, body, { headers: headers })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch(err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            });

        return resposta;
    }
}
