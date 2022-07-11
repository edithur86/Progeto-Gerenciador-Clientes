import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService  {

  private loginSubject = new Subject<boolean>();

  constructor() {

  }

  configureLogin(token, user): void {
    localStorage.setItem( environment.dnsName + ':token', token);
    localStorage.setItem( environment.dnsName + ':user', JSON.stringify(user));
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
