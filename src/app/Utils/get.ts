export class Get {

    public static byteToHex(byte) {
        return ('0' + byte.toString(16)).slice(-2);
    }

    public static generateId(len = 40): string {
        var arr = new Uint8Array(len / 2);
        window.crypto.getRandomValues(arr);
        return Array.from(arr,  this.byteToHex).join("");
    }


}