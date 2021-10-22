import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-listar',
  templateUrl: './pedido-listar.component.html',
  styleUrls: ['./pedido-listar.component.css']
})
export class PedidoListarComponent implements OnInit {

  constructor(public pedidoService: PedidoService, 
              public toastr: ToastrService) { }

  ngOnInit(): void {
    this.pedidoService.obtenerPedidos();
  }

  eliminarPedido(cot_empresa: string,cot_numero: string, cot_pedido: string){
    if(confirm('Seguro de eliminar el registro?')){
      this.pedidoService.eliminarPedido(cot_empresa,cot_numero,cot_pedido).
      subscribe(data => { this.toastr.warning('Registro Eliminada', 'El pedido fue eliminado'), 
                          this.pedidoService.obtenerPedidos();});
    }
  }

  editar(pedido: any){
    this.pedidoService.actualizar(pedido);
  }
}
