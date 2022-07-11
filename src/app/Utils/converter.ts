export class Converter {

    public static toPDF(value) {
        const byteString = window.atob(value);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([int8Array], { type: 'application/pdf' });
        return blob;
    }

    public static toPDF2(value) {
        const byteString = window.atob(value.htmlModelo);

        const arrayBuffer = new ArrayBuffer(byteString.length);
        const int8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
            int8Array[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([int8Array], { type: 'application/pdf' });

        return blob;
    }

    public static b64ToUtf_8(b64String: string): string {
        return decodeURIComponent(atob(b64String).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    }

    public static downloadString(toDownload: string, nomeArquivo: string) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + toDownload);
        element.setAttribute('download', nomeArquivo);
        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();

        document.body.removeChild(element);
    }
}