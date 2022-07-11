import { Injectable } from '@angular/core';
import { PoI18nService } from '@po-ui/ng-components';

@Injectable({
    providedIn: 'root'
})

export class DateUtil {


    literals;

    constructor(
        private poI18nService: PoI18nService
    ) {
        const idioma: string = navigator.language.toLowerCase();
        this.poI18nService.getLiterals({ language: idioma }).subscribe(body => this.literals = body);
    }

    extenso(dias: number): string {
        if (dias < 0) dias = dias * -1;
        let oRetorno: string = "";
        if (dias >= 360) {
            let anos = dias / 360 | 0;
            if (anos > 1)
                oRetorno += anos + " " + this.literals.years + " "
            else
                oRetorno += anos + " " + this.literals.year + " "
            dias = dias - (anos * 360)
        }

        if (dias > 30) {
            let meses = dias / 30 | 0;
            if (meses > 1)
                oRetorno += meses + " " + this.literals.months + " "
            else
                oRetorno += meses + " " + this.literals.month + " "
            dias = dias - (meses * 30)
        }

        if (dias >= 1) {
            if (dias > 1)
                oRetorno += dias + " " + this.literals.dias + " "
            else
                oRetorno += dias + " " + this.literals.dia + " "
        }

        return oRetorno;
    }

    extensoPorMs(milissegundos: number): string {
        let oRetorno: string = "";
        let seg = Number.parseInt((milissegundos / 1000).toString());
        let min = Number.parseInt((seg / 60).toString());
        let horas = Number.parseInt((min / 60).toString());
        let dias = Number.parseInt((horas / 24).toString());

        if (dias > 0) {
            oRetorno += dias.toString() + "dias, "
            if (dias == 1) {
                oRetorno = dias.toString() + "dia, "
            }
            horas = horas - dias * 24;
            min = min - (dias * 60 * 24);
            seg = seg - (dias * 60 * 60 * 24);
        }
        if (horas < 24 && horas > 0) {
            oRetorno += horas.toString() + "h"
            min = min - horas * 60;
            seg = seg - (horas * 60 * 60);
        }
        if (min < 60 && min > 0) {
            oRetorno += min.toString() + "min"
            seg = seg - min * 60;
        }
        if (seg < 60) {
            oRetorno += seg.toString() + "s."
        }
        return oRetorno;
    }

    parseToDateToLocale(dataStr: string): string {
        const regex = /^([0-9]{4})[-](0[1-9]|1[0-2])[-](0[0-9]|1[0-9]|2[0-9]|3[0-1])/gm
        const dateRx = new Date(dataStr)
        const [full, year, month, day] = regex.exec(dateRx.toISOString())

        return (`${day}/${month}/${year}`)
    }

    parseToDateToSystem(dataStr: string): Date {
        const regex = /^([0-9]{4})[-](0[1-9]|1[0-2])[-](0[0-9]|1[0-9]|2[0-9]|3[0-1])/gm
        const dateRx = new Date(dataStr)
        const [full, year, month, day] = regex.exec(dateRx.toISOString())

        return (new Date(`${year}/${month}/${day}`))
    }

    //Para modelo de data 0000-00-00
    validateDate(data) {
        // Ex: 0000-00-00
        var regex = "\\d{4}-\\d{2}-\\d{2}";
        var dtArray = data.split("-");      
        if (dtArray == null)
            return false;      
        // Checks for yyyy-mm-dd format.
        var dtYear = dtArray[0];
        var dtMonth = dtArray[1];
        var dtDay= dtArray[2];
      
        if (dtMonth < 1 || dtMonth > 12)
            return false;
        else if (dtDay < 1 || dtDay> 31)
            return false;
        else if ((dtMonth==4 || dtMonth==6 || dtMonth==9 || dtMonth==11) && dtDay ==31)
            return false;
        else if (dtMonth == 2)
        {
            var isleap = (dtYear % 4 == 0 && (dtYear % 100 != 0 || dtYear % 400 == 0));
            if (dtDay> 29 || (dtDay ==29 && !isleap))
                return false;
        }
        return true;
    }
}