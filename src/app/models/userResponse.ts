import { CnfUsuario } from "./cnfUsuario";

export class UserResponse{
    empresa!:string;
    user!: string;
    user_name!: string;
    user_role!: string;
    token!: string;
    confi!: CnfUsuario;
}