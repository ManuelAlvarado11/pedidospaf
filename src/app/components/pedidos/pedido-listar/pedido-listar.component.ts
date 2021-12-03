import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-listar',
  templateUrl: './pedido-listar.component.html',
  styleUrls: ['./pedido-listar.component.css']
})
export class PedidoListarComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  isDataAvailable:boolean = false;
  pedidos: any[] = [];

  constructor(public pedidoService: PedidoService, 
              public toastr: ToastrService) { }

  ngOnInit(): void {
     //CARGAR PEDIDOS
    this.pedidoService.obtenerPedidos().subscribe(data => {
      this.pedidos = data;
      this.isDataAvailable = true;
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      lengthMenu : [5, 10, 25],
      processing: true
    };
  }

  eliminarPedido(cot_empresa: string,cot_numero: string){
    if(confirm('Seguro de eliminar el registro?')){
      this.pedidoService.eliminarPedido(cot_empresa,cot_numero).
      subscribe(data => { this.toastr.warning('Registro Eliminada', 'El pedido fue eliminado'), 
                          this.pedidoService.obtenerPedidos();});
    }
  }

  editar(pedido: any){
    this.pedidoService.actualizar(pedido);
  }
}
