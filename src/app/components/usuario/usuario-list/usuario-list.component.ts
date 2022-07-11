import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService, PoI18nService, PoNotificationService } from '@po-ui/ng-components';
import { ParametroModel } from 'src/app/models/parametro.model';
import { UsuarioDTO } from 'src/app/models/usuario/usuario.dto';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { AbstractPage } from '../../abstract-page';
import { UsuarioDeleteProvider } from './../../../services/Usuario/usuario-delete-provider';
import { UsuarioGetProvider } from './../../../services/Usuario/usuario-get-provider';

@Component({
    selector: 'app-usuario-list',
    templateUrl: './usuario-list.component.html',
    styleUrls: ['./usuario-list.component.css']
})
export class UsuarioListComponent extends AbstractPage implements OnInit {

    usuarios: Array<UsuarioDTO> = [];

    constructor(
        private poAlert: PoDialogService,
        private router: Router,
        public i18nService: PoI18nService,
        private usuarioGetProvider: UsuarioGetProvider,
        private usuarioDeleteProvider: UsuarioDeleteProvider,
        private networkUtil: NetworkUtil,
        private notification: PoNotificationService
    ) {
        super(i18nService);
    }

    ngOnInit(): void {
        this.carregaMais = false;

        this.title = this.literals.usuario;

        this.colunas = [
            { property: 'codigo', label: this.literals.codigo },
            { property: 'usuario', label: this.literals.usuario },
            { property: 'email', label: this.literals.email },
            { property: 'dateCreate', format: 'dd/MM/yyyy', type: 'date', label: this.literals.dataInicio },
            {
                property: 'ativoStr',
                type: 'label',
                label: this.literals.ativo,
                width: '8%',
                labels: [
                    { value: 'true', color: 'color-11', label: this.literals.ativo },
                    { value: 'false', color: 'color-08', label: this.literals.inativo }
                ]
            }
        ];

        this.inicializaObjetos();
        this.createItens(false);
    }

    getListItems() {
        return this.usuarios;
    }

    inicializaObjetos() {
        this.breadcrumb = { items: [] };
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.inicio, link: '/' });
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.usuario, link: undefined });

        this.actions = [
            { icon: 'po-icon-plus', label: this.literals.adicionar, action: this.adicionar.bind(this) },
            {
                icon: 'po-icon-edit', label: this.literals.editar, action: this.editar.bind(this),
                disabled: this.desabilitaBotoesEditar.bind(this)
            },
            {
                icon: 'po-icon-delete', label: this.literals.excluir, action: this.excluir.bind(this),
                disabled: this.desabilitaBotoesDeletar.bind(this)
            }
        ];
    }

    async showMore() {
        if (this.labelFilter) {
            this.parametros.push(new ParametroModel('filter', this.labelFilter));
        }
        await this.createItens(true, null, this.parametros);
    }

    async createItens(showMore?: boolean, pesquisa?: string, params?: ParametroModel[]) {
        try {
            this.hideLoading = false;

            this.prepareParameters(showMore, pesquisa, params);
            if (!showMore) {
                this.usuarios = [];
            }

            let resposta = await this.usuarioGetProvider.getUsuarios("codigo", this.page, this.parametros);
            this.usuarios = this.usuarios.concat(resposta.items);
            this.usuarios.forEach(usuario => {
                usuario['ativoStr'] = usuario.ativo.toString();
            });

            if (this.usuarios && resposta.items.length > 0 && resposta.hasNext) {
                this.carregaMais = true;
            } else {
                this.carregaMais = false;
            }

            this.hideLoading = true;

        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro);
            this.hideLoading = true;
        }
    }

    adicionar(): void {
        this.router.navigate(['usuario/new']);
    }

    editar(): void {
        const blocos: UsuarioDTO = this.usuarios.find(tipo => tipo['$selected']);
        if (blocos) {
            this.router.navigate(['usuario/edit', blocos.id]);
        }
    }

    excluir(): void {
        const selecionados: UsuarioDTO[] = this.usuarios.filter(blocos => blocos['$selected']);
        if (selecionados.length >= 1) {
            this.poAlert.confirm({
                title: this.literals.confirmacao,
                message: this.literals.perg_deseja_excluir_seleci,
                confirm: () => {
                    this.delete(selecionados);
                },
                cancel: () => undefined
            });
        }
    }

    async delete(usuarios: UsuarioDTO[]) {
        this.hideLoading = false;
        try {
            if (usuarios.length >= 1) {
                for (let usuario of usuarios) {
                    await this.usuarioDeleteProvider.deleteById(usuario.id);
                }
                this.notification['success'](this.literals.excluidoUsuarioSucesso);
                await this.createItens(false);
            }
        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro)
        }
        this.hideLoading = true;
    }

}
