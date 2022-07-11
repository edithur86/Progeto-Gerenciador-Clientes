import { ClienteEnderecoDTO } from "./cliente-endereco.dto";

export class ClienteDTO {
    id: string;
    codigo: string;
    nome: string;
    cnpjCpf: string;
    telResidencial: string; 
    email: string;
    cep: string;
    endereco: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    ativo:boolean;
    enderecos: ClienteEnderecoDTO[] = new Array<ClienteEnderecoDTO>();
    dateCreate: Date;
    sessaoCreate: string;
    dateUpdate: Date;
    sessaoUpdate: string;
   
}
