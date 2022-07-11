import { registerLocaleData } from '@angular/common';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { PoI18nConfig, PoI18nModule, PoModule } from '@po-ui/ng-components';
import { PoPageLoginModule } from '@po-ui/ng-templates';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { generalEn } from './i18n/general-en';
import { generalEs } from './i18n/general-es';
import { generalPt } from './i18n/general-pt';
import ptBr from '@angular/common/locales/pt';


registerLocaleData(ptBr);
const i18nConfig: PoI18nConfig = {
  default: {
    language: 'pt-BR',
    context: 'general',
    cache: true
  },
  contexts: {
    general: {
      'pt-BR': generalPt,
      'en-US': generalEn,
      'es-ES': generalEs
    },
  }
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    PoModule,
    PoPageLoginModule,
    RouterModule.forRoot([], { relativeLinkResolution: 'legacy' }),
    PoI18nModule.config(i18nConfig),
    BrowserAnimationsModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' },],
  bootstrap: [AppComponent]
})
export class AppModule { }
