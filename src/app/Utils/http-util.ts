import { HttpParams } from '@angular/common/http';

export class HTTPUtil {
    static getParams = function (params) {
        var httpParams = new HttpParams();
        if (params) {
            for (var _i = 0, params_1 = params; _i < params_1.length; _i++) {
                var param = params_1[_i];
                httpParams = httpParams.append(param.chave, param.valor);
            }
        }
        return httpParams;
    };
}
