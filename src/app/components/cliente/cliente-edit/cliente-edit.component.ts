import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoI18nService, PoLookupComponent, PoNotificationService, PoRadioGroupOption, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { ClienteDTO } from 'src/app/models/cliente/cliente.dto';
import { ClienteGetProvider } from 'src/app/services/cliente/cliente-get-provider';
import { ClientePostProvider } from 'src/app/services/cliente/cliente-post-provider';
import { ClientePutProvider } from 'src/app/services/cliente/cliente-put-provider';
import { NetworkUtil } from 'src/app/Utils/network-util';
@Component({
    selector: 'app-cliente-edit',
    templateUrl: './cliente-edit.component.html',
    styleUrls: ['./cliente-edit.component.css']
})
export class ClienteEditComponent implements OnInit {

    title: string;
    ambienteType: Array<PoSelectOption> = [];
    hideLoading: boolean;
    breadcrumb: PoBreadcrumb;
    literals: any;
    colunas: Array<PoTableColumn> = [];
    edit: boolean;
    cliente: ClienteDTO = new ClienteDTO();
    options: Array<PoRadioGroupOption> = [];
    telResidencial: string;
    mask: string = "999.999.999-99"
    minLength: number = 14;
    maskTelefoneResidencial: string = "(99) 9999-99999"
    maskTelefoneCelular: string = "(99) 9999-9999"

    constructor(
        private poI18nService: PoI18nService,
        private state: ActivatedRoute,
        private clienteGetSrv: ClienteGetProvider,
        private clientePostSrv: ClientePostProvider,
        private clientePutSrv: ClientePutProvider,
        private networkUtil: NetworkUtil,
        private router: Router,
        private poAlert: PoDialogService,
        private notification: PoNotificationService,

    ) {
        const idioma: string = navigator.language.toLowerCase();
        this.poI18nService.getLiterals({ language: idioma }).subscribe(body => this.literals = body);
    }

    @ViewChild("codigoField", { static: true }) codigoField: PoLookupComponent;

    async ngOnInit(): Promise<void> {
        this.hideLoading = false;
        this.breadcrumb = { items: [] };
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.inicio, link: '/' });

        this.colunas = [
            { property: 'endereco', label: this.literals.endereco, width: '50%' },
            { property: 'numero', label: this.literals.numero, width: '14%' },
            { property: 'bairro', label: this.literals.bairro, width: '18%' },
            { property: 'cidade', label: this.literals.cidade, width: '18%' },
        ];

        if (this.state && this.state.snapshot.params['id']) {
            this.edit = true;
            this.iniciaObjetos(this.state.snapshot.params['id']);
            this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.cliente, link: '/cliente' });
            this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.editar, link: undefined });
        } else {
            this.edit = false;
            this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.cliente, link: '/cliente' });
            this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.novo, link: undefined });
            this.iniciaObjetos();
        }
        this.hideLoading = true;
    }

    async iniciaObjetos(id?: string) {

        try {
            if (id) {
                this.cliente = await this.clienteGetSrv.getById(id);
                this.title = `${this.literals.editarCliente}: ${this.cliente.nome}`;
            } else {
                this.cliente = new ClienteDTO();
                this.cliente.nome = this.cliente.nome;
                this.title = `${this.literals.editarCliente}`;
            }
        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro);
        }

    }
    async EventSave() {
        await this.save();
        this.router.navigate(['cliente']);
    }

    async EventSaveNew() {
        await this.save(true);
        this.router.navigate(['cliente/new']);
        this.codigoField.focus();
    }


    async save(saveNew?: boolean) {
        try {
            if (this.edit) {
                await this.clientePutSrv.put(this.cliente.id, this.cliente);
                this.notification['success'](this.literals.editUsuarioSucesso);
                this.cliente = new ClienteDTO();
            } else {
                await this.clientePostSrv.post(this.cliente);
                this.notification['success'](this.literals.insertUsuarioSucesso);
                this.cliente = new ClienteDTO();

            }
            this.cliente = new ClienteDTO();
            this.router.navigate(['cliente/new']);
        } catch (erro) {
            this.networkUtil.exibeMsgErroRequisicao(erro);
        }
    }

    EventCancel() {
        this.poAlert.confirm({
            title: this.literals['confirmacao'],
            message: this.literals['perg_voltar_pag_anterior'],
            confirm: () => this.router.navigate(['cliente']),
            cancel: () => undefined
        });
    }
   
    async changeMaskTelefones(value) {

        if (value == "residencial") {
            if (this.cliente.telResidencial.length <= 14) {
                this.maskTelefoneResidencial = "(99) 9999-99999";
            } else {
                this.maskTelefoneResidencial = "(99) 9999-9999";
            }
        }
    }
     validaCPF(value) {
        if (!validaCpfCnpj(value)) {
            console.log('entrou')
            this.cliente.cnpjCpf = null;
            this.notification.error(this.literals.cpfInvalido)
            } 
        }
    }
 

 function validaCpfCnpj(val) {
    if (val.length == 14) {
        var cpf = val.trim();

        cpf = cpf.replace(/\./g, '');
        cpf = cpf.replace('-', '');
        cpf = cpf.split('');

        var v1 = 0;
        var v2 = 0;
        var aux = false;

        for (var i = 1; cpf.length > i; i++) {
            if (cpf[i - 1] != cpf[i]) {
                aux = true;
            }
        }

        if (aux == false) {
            return false;
        }

        for (var i = 0, p = 10; (cpf.length - 2) > i; i++, p--) {
            v1 += cpf[i] * p;
        }

        v1 = ((v1 * 10) % 11);

        if (v1 == 10) {
            v1 = 0;
        }

        if (v1 != cpf[9]) {
            return false;
        }

        for (var i = 0, p = 11; (cpf.length - 1) > i; i++, p--) {
            v2 += cpf[i] * p;
        }

        v2 = ((v2 * 10) % 11);

        if (v2 == 10) {
            v2 = 0;
        }

        if (v2 != cpf[10]) {
            return false;
        } else {
            return true;
        }
    }
} 

