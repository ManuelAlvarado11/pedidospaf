import { Cliente } from "./cliente";
import { DetallePedido } from "./detallePedido";

 export class Pedido {
    cot_empresa!: string;
    cot_numero!: string;
    cot_pedido!: string;
    cot_fecha!: Date;
    cot_vendedor!: string;
    cot_bodega!: string;
    cot_cliente!: string;
    cot_nombre!: string;
    cot_direccion!: string;
    cot_telefono!: string;
    cot_email!: string;
    cot_tamaño!: string;
    cot_exento!: boolean;
    cot_extranjero?: boolean;
    cot_referencia?: string;
    cot_tipo_documento!: string;
    cot_gravada!: number;
    cot_iva!: number;
    cot_exenta!:number;
    cot_retencion!:number;
    cot_descuento!: number;
    cot_total!: number;
    cot_anulada!: boolean;
    cot_factura!: string;
    cliente?: Cliente;
    detalles!: DetallePedido[];
 }