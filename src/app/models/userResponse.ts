import { CnfUsuario } from "./cnfUsuario";
import { Vendedor } from "./vendedor";

export class UserResponse{
    empresa!:string;
    user!: string;
    user_name!: string;
    user_role!: string;
    token!: string;
    confi!: CnfUsuario;
    vendedor!: Vendedor;
}