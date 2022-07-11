import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Input } from '@angular/core';
import { EventEmitter } from 'protractor';
import { Observable, Subject } from 'rxjs';
import { BaseService } from 'src/app/base/base.service';
import { LoginDTO } from 'src/app/models/login/login.dto';
import { environment } from 'src/environments/environment';
import { HttpService } from '../http.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService extends BaseService<LoginDTO> {

  private loginSubject = new Subject<boolean>();

  constructor(public http: HttpService,
    private httpCli: HttpClient) {
    super('users', http);
  }

  authenticate(email: string, password: string) {
    let headers: HttpHeaders =  new HttpHeaders();
    let strLogin = email + ":" + password;
    headers = headers.append('Authorization', 'Basic ' + btoa(strLogin));

    return this.httpCli.post(
      `${environment.urlBaseApi}login`, 
        null,
        {
            headers: headers,
            observe: 'response'
            
        });
  }

  configureLogin(token, user): void {
    localStorage.setItem(environment.dnsName + ':token', token);
    localStorage.setItem(environment.dnsName + ':user', JSON.stringify(user));
    this.loginSubject.next(this.isStaticLogged);
  }

  logout(): void {
    localStorage.removeItem(environment.dnsName + ':token');
  }

  get isLogged(): Observable<boolean> {
    return this.loginSubject.asObservable();

  }
  get isStaticLogged(): boolean {
    return !!localStorage.getItem(environment.dnsName + ':token');
  }

  static get token(): string {
    return localStorage.getItem(environment.dnsName + ':token');
  }
}
