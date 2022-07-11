import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoI18nService, PoNotificationService } from '@po-ui/ng-components';
import { UsuarioUpdateSenhaDTO } from './../../../models/usuario/usuario-update-senha.dto';
import { UsuarioPutProvider } from './../../../services/Usuario/usuario-put-provider';
import { NetworkUtil } from './../../../Utils/network-util';

@Component({
    selector: 'app-usuario-mudar-senha',
    templateUrl: './usuario-mudar-senha.component.html',
    styleUrls: ['./usuario-mudar-senha.component.css']
})
export class UsuarioMudarSenhaComponent implements OnInit {

    title: string;
    hideLoading: boolean;
    breadcrumb: PoBreadcrumb;
    literals: any;
    usuarioUpdate: UsuarioUpdateSenhaDTO = new UsuarioUpdateSenhaDTO();

    constructor(
        private poI18nService: PoI18nService,
        public i18nService: PoI18nService,
        private state: ActivatedRoute,
        private router: Router,
        private usuarioPutProvider: UsuarioPutProvider,
        private notification: PoNotificationService,
        private poAlert: PoDialogService,
        private networkUtil: NetworkUtil
    ) {
        const idioma: string = navigator.language.toLowerCase();
        this.poI18nService.getLiterals({ language: idioma }).subscribe(body => this.literals = body);
    }

    ngOnInit(): void {
        this.hideLoading = false;
        this.title = this.literals.usuarioAlterarSenha;
        this.inicializaObjetos();
        this.hideLoading = true;
    }

    inicializaObjetos() {
        this.breadcrumb = { items: [] };
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.inicio, link: '/' });
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.usuario, link: undefined });

        if (this.state && this.state.snapshot.params['id']) {
            this.usuarioUpdate.idUsuario = this.state.snapshot.params['id'];
        }

    }


    async EventSave() {
        try {
            await this.usuarioPutProvider.putUpdateSenha(this.usuarioUpdate);
            this.notification['success'](this.literals.senhaAlteradaSucesso);
            this.usuarioUpdate = new UsuarioUpdateSenhaDTO();
            this.router.navigate(['home']);
        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro);
        }
    }

    EventCancel() {
        this.poAlert.confirm({
            title: this.literals['confirmacao'],
            message: this.literals['perg_voltar_pag_anterior'],
            confirm: () => this.router.navigate(['home']),
            cancel: () => undefined
        });
    }


}
