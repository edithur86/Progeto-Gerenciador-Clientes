import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoI18nService, PoNotification, PoNotificationService } from '@po-ui/ng-components';
import { TimeoutError } from 'rxjs';
import { environment } from './../../environments/environment';
import { WebConfig } from './web-config';

@Injectable({
    providedIn: 'root'
})

export class NetworkUtil {

    static TIMEOUT = 60000;

    literals;

    constructor(
        private thfI18nService: PoI18nService,
        private poAlert: PoDialogService,
        public notification: PoNotificationService,
        private router: Router,
        private location: Location
    ) {
        const idioma: string = navigator.language.toLowerCase();
        this.thfI18nService.getLiterals({ language: idioma }).subscribe(body => this.literals = body);
    }

    tratamentoErroAPI(err) {
        if (err && err.error) {
            if (err.error.detalhes) {
                if (err.error.detalhes.length > 1) {
                    return err.error;
                } else {
                    if (err.error.detalhes[0].message) {
                        return new Error(err.error.detalhes[0].message);
                    }
                }
            } else {
                let msg = err.error.detailedMessage ? err.error.detailedMessage : err.error.msg;
                if (!msg && err.error && err.error.error == "Forbidden") {
                    localStorage.setItem(environment.dnsName + ':token', "");
                    localStorage.setItem(environment.dnsName + ':user', "");
                    location.reload();
                    return new Error(msg);
                } else {
                    return new Error(msg);
                }
            }
        } else if (err instanceof (TimeoutError)) {
            return new Error(this.literals.http.timeout);
        } else if(err.status = '403'){
            localStorage.setItem(environment.dnsName + ':token', "");
            localStorage.setItem(environment.dnsName + ':user', "");
            location.reload();
            return new Error(this.literals.http.falhaGenerica);
        }

        return new Error(this.literals.http.falhaGenerica);
    }

    exibeMsgErroRequisicao(erro) {
        let poNotification: PoNotification;
        let msgsAlerta: string = "";

        if (erro.detalhes) {
            for (const det of erro.detalhes) {
                msgsAlerta += det.message + " ";
            }

            poNotification = {
                message: erro.msg,
                actionLabel: this.literals.detalhes,
                action: () => {
                    this.poAlert.alert({
                        title: erro.message,
                        message: msgsAlerta
                    });
                }
            }
        } else {
            if (erro.msg) {
                poNotification = {
                    message: erro.msg
                }
            } else {
                poNotification = {
                    message: erro
                }
            }
        }

        poNotification.duration = WebConfig.TEMPO_MSGS;

        this.notification.error(poNotification);
    }

    

}