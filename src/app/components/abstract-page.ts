import { PoBreadcrumb, PoDisclaimer, PoI18nService, PoPageAction, PoPageFilter, PoTableColumn } from '@po-ui/ng-components';
import { ParametroModel } from '../models/parametro.model';
import { FilterAdvancedDTO } from './../models/filter-advanced-dto';

export abstract class AbstractPage {
    public title: string;
    public actions: Array<PoPageAction> = [];
    public breadcrumb: PoBreadcrumb;
    private idioma: string;
    public literals: any;
    public page = 1;
    public parametros: ParametroModel[] = [];
    public carregaMais: boolean;
    public hideLoading: boolean;

    public colunas: Array<PoTableColumn> = [];
    public colunasFinanceiroTipo: Array<PoTableColumn> = [];
    disclaimer: PoDisclaimer;
    disclaimers: Array<PoDisclaimer> = [];
    // disclaimer de filtros
    public filterSettings: PoPageFilter;
    public labelFilter: String = '';

    constructor(
        public i18nService: PoI18nService
    ) {
        this.idioma = navigator.language.toLocaleLowerCase();
        this.i18nService.getLiterals({ language: this.idioma })
            .subscribe(literals => this.literals = literals);

        this.filterSettings = {
            action: this.filterAction.bind(this),
            placeholder: this.literals['pesquisa']
        };
    }

    public prepareParameters(showMore?: boolean, pesquisa?: string, params?: ParametroModel[]): void {
        if (!showMore) {
            this.page = 0;
        }
        this.page = this.page + 1;
        this.parametros = [];

        this.parametros.push(new ParametroModel('page', this.page));
        this.parametros.push(new ParametroModel('pageSize', 20));

        if (!pesquisa) {
            this.parametros.push(new ParametroModel('order', 'descricao'));
        }

        if (this.disclaimers.length > 0) {
            let filtrosAdv: FilterAdvancedDTO[] = [];
            this.disclaimers.forEach(item => {
                filtrosAdv.push(item.value);
            });
            var encoded = btoa(unescape(encodeURIComponent(JSON.stringify(filtrosAdv))));
            this.parametros.push(new ParametroModel('filterAdvanced', encoded));
        }

        if (this.labelFilter) {
            this.parametros.push(new ParametroModel('filter', this.labelFilter));
        }

        if (params) {
            this.parametros = this.parametros.concat(params);
        }

    }

    public async filterAction(filter = [this.labelFilter]) {
        if (filter) {
            let params: ParametroModel[] = [];
            params.push(new ParametroModel('filter', filter));
            await this.createItens(false, null, params);
        } else {
            await this.createItens(false);
        }
    }

    abstract createItens(showMore?: boolean, pesquisa?: string, params?: ParametroModel[])

    public getListItems() {
        return [];
    }

    public desabilitaBotoesEditar(): boolean {
        const selecionados: any[] = this.getListItems().filter(item => item['$selected']);
        if (selecionados) {
            return selecionados.length !== 1;
        }
        return true;
    }

    public desabilitaBotoesDeletar(): boolean {
        const selecionados: any[] = this.getListItems().filter(item => item['$selected']);
        if (selecionados) {
            return selecionados.length <= 0;
        }
        return true;
    }
}
