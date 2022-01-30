import { CnfPtovta } from "./cnfPtovta";

export class PuntoVenta{
    pvt_empresa!:string;
    pvt_codigo!: string;
    pvt_descripcion!: string;
    pvt_bodega!: string;
    fac_cnf_ptovta_cf2!: CnfPtovta[];
}