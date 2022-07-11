import { Injectable } from '@angular/core';
import { PoDialogService, PoNotification, PoNotificationService } from '@po-ui/ng-components';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private poNotification: PoNotificationService,
    private poAlert: PoDialogService
  ) { }

  async toast( title:string, position: any = 'top'): Promise<void>{
    const poNotification: PoNotification = {
      message: title,
      orientation: position,
      action: undefined,
      actionLabel: undefined,
      duration: 7000
    };
    this.poNotification.success(poNotification);
  }

  async alert(title: string, message: string): Promise<void>{
    this.poAlert.alert({
      literals: { ok: 'Ok' },
      title: title,
      message: message,
      ok: () => undefined
    });
  }

  async confirm(title: string, message: string, callback: any): Promise<void> {
    this.poAlert.confirm({
      literals:  { cancel: 'Não', confirm: 'Sim' },
      title: title,
      message: message,
      confirm: () => callback(),
      cancel: () =>  undefined
    });
  }
}
