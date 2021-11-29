import { DetallePedido } from "./detallePedido";

 export class Pedido {
    cot_empresa!: string;
    cot_numero!: string;
    cot_pedido!: string;
    cot_fecha!: Date;
    cot_vendedor!: string;
    cot_bodega!: string;
    cot_cliente!: string;
    cot_tipo_documento!: string;
    cot_total!: number;
    cot_anulada!: boolean;
    detalles!: DetallePedido[];
 }