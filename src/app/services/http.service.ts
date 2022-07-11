import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PoDialogService, PoI18nService, PoNotification, PoNotificationService } from '@po-ui/ng-components';
import { TimeoutError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IResultHttp } from '../interfaces/IResultHttp';
import { WebConfig } from './../Utils/web-config';
import { AlertService } from './alert.service';


@Injectable({
    providedIn: 'root'
})
export class HttpService {

    literals;

    constructor(
        private http: HttpClient,
        private alertSrv: AlertService,
        private poI18nService: PoI18nService,
        private poAlert: PoDialogService,
        private notification: PoNotificationService) {
        const idioma: string = navigator.language.toLowerCase();
        this.poI18nService.getLiterals({ language: idioma }).subscribe(body => this.literals = body);
    }

    private createHeader(header?: HttpHeaders): HttpHeaders {

        if (!header) {
            header = new HttpHeaders();
        }

        header = header.append('Content-Type', 'application/json');
        header = header.append('Accept', 'application/json');
        header = header.append('X-PO-No-Message', 'true');

        const token = localStorage.getItem(environment.dnsName + ':token');
        if (token) {
            header = header.append('Authorization', token);
        }

        return header;
    }

    public get(url: string): Promise<IResultHttp> {
        const header = this.createHeader();
        return new Promise(async (resolve) => {
            try {
                const res = await this.http.get(url, { headers: header }).toPromise();
                resolve({ success: true, data: res, error: undefined });
            } catch (error) {
                resolve({ success: false, data: {}, error });
            }
        });
    }

    public post(url: string, model: any, headers?: HttpHeaders): Promise<IResultHttp> {
        const header = this.createHeader(headers);
        return new Promise(async (resolve) => {
            try {
                const res = await this.http.post(url, model, { headers: header }).toPromise();
                resolve({ success: true, data: res, error: undefined });
            } catch (error) {
                throw this.exibeMsgErroRequisicao(error);
                // if (error.status === 400) {
                //   let errorsText = '<ul>';
                //   if (Array.isArray(error.error)) {
                //     error.error.forEach(element => {
                //       errorsText += `<li style="text-align: left">${element.message || element}</li>`;
                //     });
                //     errorsText += '</ul>';
                //     this.alertSrv.alert('Atenção', errorsText);
                //   }
                // }
                // resolve({ success: false, data: {}, error });
            }
        });
    }

    exibeMsgErroRequisicao(erro) {
        let poNotification: PoNotification;
        let msgsAlerta: string = "";
        let exibeMsg: boolean = false;
        if (Array.isArray(erro.error)) {
            for (const det of erro.error) {
                msgsAlerta += det.msg + " ";
            }

            poNotification = {
                message: erro.msg,
                actionLabel: this.literals.detalhes,
                action: () => {
                    this.poAlert.alert({
                        title: erro.msg,
                        message: msgsAlerta
                    });
                }
            }
            exibeMsg = true;
        } else {
            if (erro.error.msg) {
                exibeMsg = true;
            }
            poNotification = {
                message: erro.error.msg
            }
        }

        poNotification.duration = WebConfig.TEMPO_MSGS;
        if (exibeMsg) this.notification.error(poNotification);
    }

    tratamentoErroAPI(err) {
        if (err && err.error) {
            if (err.error.details) {
                if (err.error.details.length > 1) {
                    return err.error;
                } else {
                    if (err.error.details[0].message) {
                        return new Error(err.error.details[0].message);
                    }
                }
            } else {
                let msg = err.error.detailedMessage ? err.error.detailedMessage : err.error.msg;
                if (msg) {
                    return new Error(msg);
                }
            }
        } else if (err instanceof (TimeoutError)) {
            return new Error(this.literals.http.timeout);
        }

        return new Error(this.literals.http.falhaGenerica);
    }

    public put(url: string, model: any, headers?: HttpHeaders): Promise<IResultHttp> {
        const header = this.createHeader(headers);
        return new Promise(async (resolve) => {
            try {
                const res = await this.http.put(url, model, { headers: header }).toPromise();
                resolve({ success: true, data: res, error: undefined });
            } catch (error) {
                throw this.exibeMsgErroRequisicao(error);
            }
        });
    }

    public delete(url: string): Promise<IResultHttp> {
        const header = this.createHeader();
        return new Promise(async (resolve) => {
            try {
                const res = await this.http.delete(url, { headers: header }).toPromise();
                resolve({ success: true, data: res, error: undefined });
            } catch (error) {
                resolve({ success: false, data: {}, error });
            }
        });
    }

}
