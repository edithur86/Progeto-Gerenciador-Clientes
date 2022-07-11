import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoEmailComponent, PoI18nService, PoLookupColumn, PoModalComponent, PoNotificationService, PoTableColumn } from '@po-ui/ng-components';
import { UsuarioDTO } from 'src/app/models/usuario/usuario.dto';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { UsuarioGetProvider } from './../../../services/Usuario/usuario-get-provider';
import { UsuarioPostProvider } from './../../../services/Usuario/usuario-post-provider';
import { UsuarioPutProvider } from './../../../services/Usuario/usuario-put-provider';

@Component({
    selector: 'app-usuario-edit',
    templateUrl: './usuario-edit.component.html',
    styleUrls: ['./usuario-edit.component.css']
})
export class UsuarioEditComponent implements OnInit {
    title: string;
    hideLoading: boolean;
    breadcrumb: PoBreadcrumb;
    literals: any;
    colunas: Array<PoTableColumn> = [];
    colunasUnidadeAdministrativa: Array<PoTableColumn> = [];
    edit: boolean;
    usuario: UsuarioDTO = new UsuarioDTO();
    columnsPesquisas: Array<PoLookupColumn>;
    columnsPesquisasEntidade: Array<PoLookupColumn>;
    columnsPesquisasGrupoUsuario: Array<PoLookupColumn>;
    colunasGrupoUsuario: Array<PoTableColumn> = [];
    usuarioLogado: UsuarioDTO = new UsuarioDTO();
    usuarioMesmoLogadoNoSistema: boolean = false;
    @ViewChild('focusEmail', { static: true }) focusEmail: PoEmailComponent;

    constructor(
        private poI18nService: PoI18nService,
        private state: ActivatedRoute,
        private usuarioGetProvider: UsuarioGetProvider,
        private usuarioPostProvider: UsuarioPostProvider,
        private usuarioPutProvider: UsuarioPutProvider,
        private router: Router,
        private poAlert: PoDialogService,
        private networkUtil: NetworkUtil,
        private notification: PoNotificationService,
    ) {
        const idioma: string = navigator.language.toLowerCase();
        this.poI18nService.getLiterals({ language: idioma }).subscribe(body => this.literals = body);
    }

    ngOnInit(): void {
        this.hideLoading = false;
        this.breadcrumb = { items: [] };

        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.inicio, link: '/' });
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.usuario, link: '/usuario' });

       

        this.colunasUnidadeAdministrativa = [
            { property: 'codigo', label: this.literals['codigo'], width: '20%' },
            { property: 'descricao', label: this.literals['unidade'], width: '40%' },
            { property: 'razao', label: this.literals['razao'], width: '20%' },
            { property: 'cnpj', label: this.literals['cnpj'], width: '20%' }
        ];

        this.columnsPesquisas = [
            { property: 'codigo', label: this.literals.codigo, width: '30%' },
            { property: 'descricao', label: this.literals.nome, width: '70%' }
        ];

        this.columnsPesquisasEntidade = [
            { property: 'codigo', label: this.literals.codigo, width: '15%' },
            { property: 'cnpjCpf', label: this.literals.cpf, width: '20%' },
            { property: 'nome', label: this.literals.nome, width: '25%' },
            { property: 'bairro', label: this.literals.bairro, width: '20%' },
            { property: 'cidade', label: this.literals.cidade, width: '20%' }
        ];

        this.columnsPesquisasGrupoUsuario = [
            { property: 'codigo', label: this.literals.codigo, width: '30%' },
            { property: 'descricao', label: this.literals.nome, width: '70%' }
        ];

        this.colunasGrupoUsuario = [
            { property: 'codigo', label: this.literals.codigo },
            { property: 'descricao', label: this.literals.descricao }
        ];

        if (this.state && this.state.snapshot.params['id']) {
            this.edit = true;
            this.iniciaObjetos(this.state.snapshot.params['id']);
            this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.editar, link: undefined });
        } else {
            this.edit = false;
            this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.novo, link: undefined });
            this.iniciaObjetos();
        }
        this.hideLoading = true;
    }

    async iniciaObjetos(id?: string) {
        try {
            if (id) {
                this.usuario = await this.usuarioGetProvider.getById(id);

                this.usuarioLogado = await this.usuarioGetProvider.getMyUser();
                if (this.usuario.email == this.usuarioLogado.email) {
                    this.usuarioMesmoLogadoNoSistema = true;
                    this.notification['warning'](this.literals.erroAlterarEmailLogado);
                }
               

                this.title = `${this.literals.editar_usuario}: ${this.usuario.usuario}`;
            } else {
                this.usuario = new UsuarioDTO();
                this.title = `${this.literals.incluir_usuario}`;
            }
        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro);
        }
    }


    
    

    fieldFormatEntidadeCodigo(value) {
        return `${value.codigo} - ${value.nome}`;
    }

    fieldFormatUnidadeAdministrativaCodigo(value) {
        if (value.entidade)
            return `${value.codigo} - ${value.descricao}`;
        else
            return '';
    }


    fieldFormatGrupoUsuarioCodigo(grupo) {
        if (grupo)
            return `${grupo.codigo} - ${grupo.descricao}`;
        else
            return '';

    }


    async EventSave() {
        await this.save();
    }

    async EventSaveNew() {
        await this.save(true);
    }
    focusEnter() {
        this.focusEmail.focus();
     };

    async save(saveNew?: boolean) {
        try {
            if (this.edit) {
                if (this.usuarioMesmoLogadoNoSistema) {
                    if (this.usuario.email != this.usuarioLogado.email) {
                        this.poAlert.confirm({
                            title: this.literals.confirmacao,
                            message: this.literals.emailAntigo + " (" + this.usuarioLogado.email + "). " + this.literals.pergEmailUsuarioAlterado + this.usuario.email,
                            confirm: async () => {
                                await this.usuarioPutProvider.put(this.usuario.id, this.usuario);
                                this.notification['success'](this.literals.editUsuarioSucesso);
                                this.usuario = new UsuarioDTO();
                                saveNew ? this.router.navigate(['usuario/new']) : this.router.navigate(['usuario']);
                            },
                            cancel: () => undefined
                        });
                    } else {
                        await this.usuarioPutProvider.put(this.usuario.id, this.usuario);
                        this.notification['success'](this.literals.editUsuarioSucesso);
                        this.usuario = new UsuarioDTO();
                        saveNew ? this.router.navigate(['usuario/new']) : this.router.navigate(['usuario']);
                    }
                } else {
                    await this.usuarioPutProvider.put(this.usuario.id, this.usuario);
                    this.notification['success'](this.literals.editUsuarioSucesso);
                    this.usuario = new UsuarioDTO();
                    saveNew ? this.router.navigate(['usuario/new']) : this.router.navigate(['usuario']);
                }
            } else {
                
                await this.usuarioPostProvider.post(this.usuario);
                this.notification['success'](this.literals.insertUsuarioSucesso);
                this.usuario = new UsuarioDTO();
                saveNew ? this.router.navigate(['usuario/new']) : this.router.navigate(['usuario']);
            }
        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro);
        }
    }

    EventCancel() {
        this.poAlert.confirm({
            title: this.literals['confirmacao'],
            message: this.literals['perg_voltar_pag_anterior'],
            confirm: () => this.router.navigate(['usuario']),
            cancel: () => undefined
        });
    }

   

    eventErrorEntidade(value) {
        this.usuario.email = "";
        this.networkUtil.exibeMsgErroRequisicao(value);
    }
}
