import { Location } from '@angular/common';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoI18nService, PoMenuItem, PoToolbarAction, PoToolbarProfile } from '@po-ui/ng-components';
import { PoPageLogin } from '@po-ui/ng-templates';
import { link } from 'fs';
import { UsuarioDTO } from 'src/app/models/usuario/usuario.dto';
import { LoginService } from './services/login/login.service';
import { UsuarioGetProvider } from './services/Usuario/usuario-get-provider';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    @ViewChild('iconTemplate', { static: true } ) iconTemplate : TemplateRef<void>;
    profile: PoToolbarProfile;
    profileActions: Array<PoToolbarAction>;
    literals: any;
    usuario: UsuarioDTO = new UsuarioDTO();

    readonly menus: Array<PoMenuItem>;

    mostrarMenu: boolean = false;
    constructor(private poI18nService: PoI18nService,
        private router: Router,
        private loginSrv: LoginService,
        private usuarioSrv: UsuarioGetProvider,
        private location: Location
    ) {

        this.poI18nService.getLiterals({ language: 'pt-BR' }).subscribe((literals) => {
            this.literals = literals;
        });


        this.menus = [
            {
                label: this.literals['home'],
                shortLabel: this.literals['home'],
                icon: 'po-icon po-icon-home',
                link: '/'
            },
            {
                label: this.literals.cadastros,
                shortLabel: this.literals.cadastros,
                icon: 'po-icon po-icon-plus',
                subItems: [
                   
                    {
                        label: this.literals['usuario'],
                        shortLabel: this.literals['usuario'],
                        icon: 'po-icon po-icon-user',
                        link: '/usuario'
                    },
                    {
                        label: this.literals['cliente'],
                        shortLabel: this.literals['cliente'],
                        icon: 'po-icon po-icon-user',
                        link: '/cliente'
                    },
                   
                   
                ]
          
            },
        ];
    }

    ngOnInit(): void {
        if (this.loginSrv.isStaticLogged) {
            this.mostrarMenu = true;
            this.loadUserProfile();
        }
    }

    async loadUserProfile() {
        this.usuario = await this.usuarioSrv.getMyUser();
        this.profile = {
            avatar: "",
            title: this.usuario.usuario,
            subtitle: this.usuario.email
        };
        this.profileActions = [
            { icon: 'po-icon-exit', label: this.literals['alterarSenha'], action: () => this.updateSenhaClick() },
            { icon: 'po-icon-exit', label: this.literals['sair'], action: () => this.logoutClick() }
        ];
    }

    async loginSubmit(formData: PoPageLogin) {

        const login = await this.loginSrv.authenticate(formData.login, formData.password);
        login.subscribe(async response => {
            formData.password = "";
            this.loginSrv.configureLogin(response.headers.get('Authorization'), formData.login);
            this.loadUserProfile();
            this.mostrarMenu = true;
            location.reload();
        },
            error => { });
    }

    logoutClick() {
        this.loginSrv.logout();
        this.mostrarMenu = false;
        //TODO: contruir aqui uma chamada post para logout JWD
        this.router.navigate(['login']);
    }

    updateSenhaClick() {
        this.router.navigate(['usuario/updateSenha', this.usuario.id]);
    }
}
