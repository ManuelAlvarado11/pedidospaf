import { Detalle_pedido } from "./detalle_pedido";

 export class Pedido {
    cot_empresa!: string;
    cot_numero!: string;
    cot_pedido!: string;
    cot_vendedor!: string;
    cot_bodega!: string;
    cot_cliente!: string;
    cot_total!: number;
    cot_anulada!: boolean;
    detalles!: Detalle_pedido[];
 }