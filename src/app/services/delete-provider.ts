import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { NetworkUtil } from '../Utils/network-util';


export abstract class DeleteProvider {

    private baseURL: string;
    public uri: string;

    constructor(private http: HttpClient,
        private networkUtil: NetworkUtil) {
        this.baseURL = environment.urlBaseApi;
    }

    abstract deleteById(id: string);

    protected async _delete(id: string): Promise<any> {
        let headers = new HttpHeaders();
        
        headers = headers.append('Content-Type', 'application/json');
        headers = headers.append('Accept', 'application/json');
        headers = headers.append('X-PO-No-Message', 'true');
        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            headers = headers.append('Authorization', token);
        }

        return await this.http.delete(this.baseURL + this.uri + id, { headers: headers })
            .pipe(timeout(NetworkUtil.TIMEOUT))
            .toPromise()
            .catch(err => {
                throw this.networkUtil.tratamentoErroAPI(err);
            });
    }
}
