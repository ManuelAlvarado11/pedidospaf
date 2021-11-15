import { AsignacionPrecios } from "./asignacionPrecios";
import { ExistenciasGenerales } from "./existenciasGenerales";

export class Producto{
    pro_empresa!: string;
    pro_codigo!: string;
    pro_nombre!: string;
    pro_grupo!: string;
    pro_marca!: string;
    pro_serie!: string;
    pro_exento!: boolean;
    fac_asignacion_precios!: AsignacionPrecios[];
    fac_existencias_generales!: ExistenciasGenerales[];

}