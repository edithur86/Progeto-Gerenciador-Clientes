import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PoDialogService, PoI18nService, PoNotificationService } from '@po-ui/ng-components';
import { ClienteDTO } from 'src/app/models/cliente/cliente.dto';
import { ParametroModel } from 'src/app/models/parametro.model';
import { ClienteGetProvider } from 'src/app/services/cliente/cliente-get-provider';
import { NetworkUtil } from 'src/app/Utils/network-util';
import { AbstractPage } from '../../abstract-page';

@Component({
    selector: 'app-cliente-list',
    templateUrl: './cliente-list.component.html',
    styleUrls: ['./cliente-list.component.css']
})
export class ClienteListComponent extends AbstractPage implements OnInit {

    clientes: Array<ClienteDTO> = [];
    
    cliente: ClienteDTO = new ClienteDTO();
    cnpjCpf: string;
   


    constructor(
        private poAlert: PoDialogService,
        private router: Router,
        private state: ActivatedRoute,
        public i18nService: PoI18nService,
        private clienteService: ClienteGetProvider,
        private networkUtil: NetworkUtil,
        private notification: PoNotificationService
    ) {
        super(i18nService);
    }

    ngOnInit(): void {
        this.carregaMais = false;

        this.title = this.literals.cliente;

        this.colunas = [
            { property: 'codigo', label: this.literals.codigo },
            { property: 'cnpjCpf', label: this.literals.cpfCnpj },
            { property: 'nome', label: this.literals.nome },
            { property: 'bairro', label: this.literals.bairro },
            { property: 'cidade', label: this.literals.cidade },
            { property: 'uf', label: this.literals.uf },
            { property: 'email', label: this.literals.email },
            {
                property: 'ativo2',
                type: 'label',
                label: this.literals.situacao,
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
        return this.clientes;
    }

    inicializaObjetos() {
        this.breadcrumb = { items: [] };
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.inicio, link: '/' });
        this.breadcrumb.items = this.breadcrumb.items.concat({ label: this.literals.cliente, link: undefined });

        this.actions = [
            { icon: 'po-icon-plus', label: this.literals.adicionar, action: this.adicionar.bind(this) },
            {
                icon: 'po-icon-edit', label: this.literals.editar, action: this.editar.bind(this),
                disabled: this.desabilitaBotoesEditar.bind(this)
            },
           
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
                this.clientes = [];
            }
            let resposta;
            if (this.state.snapshot.params['id']) {
                resposta = await this.clienteService.getById(this.state.snapshot.params['id']);
                console.log(resposta)
                this.clientes.push(resposta);
            } else {
                resposta = await this.clienteService.getClientes("codigo", this.page, this.parametros);
                console.log(resposta)
                this.clientes = this.clientes.concat(resposta.items);
                this.clientes.forEach(items => {
                    items['ativo2'] = items.ativo.toString();
                });
            }

           
            this.clientes.forEach(entidade => {
                entidade.enderecos.forEach(endereco => {
                    entidade['bairro'] = endereco.bairro;
                    entidade['cidade'] = endereco.cidade;
                    entidade['uf'] = endereco.uf;
                });
               
            });
            if (this.clientes && resposta.hasNext) {
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
        this.router.navigate(['cliente/new']);
    }

    editar(): void {
        const blocos: ClienteDTO = this.clientes.find(tipo => tipo['$selected']);
        if (blocos) {
            this.router.navigate(['cliente/edit', blocos.id]);
        }
    }


    async adicionarCnpjCpf() {
            this.clientes = [];
        if (this.cliente.cnpjCpf != null){
            this.cnpjCpf =  this.cliente.cnpjCpf.trim();
            let cliente  = await this.clienteService.getByCnpjCpf(this.cnpjCpf);
            this.clientes.push(cliente);
            }
            this.clientes.forEach(items => {
                items['ativo2'] = items.ativo.toString();
            });

        }
    }
    

    
 
     
 

