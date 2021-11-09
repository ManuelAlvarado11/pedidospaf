import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from 'src/app/services/pedido.service';
import { Buscador } from 'src/app/models/buscador';


@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent{
  @ViewChild("content") content: any;
  @Input() title = "";
  opcion = 0;
  encabezados= [] as any;

  constructor(private modal: NgbModal, 
              public pedidoService: PedidoService) { }

  buscarCliente() {
    this.opcion = 1;
    this.pedidoService.obtenerPedidos();
    this.title="Buscar Cliente"
    this.encabezados= [ 
      { 
        'encabezado_1':'Codigo', 
        'encabezado_2':'Nombre',
        'encabezado_3':'Registro'
      }]; 
    
    this.modal.open(this.content);
  }
  buscarProducto(){
    this.opcion = 2;
    this.pedidoService.obtenerPedidos();
    this.title="Buscar Producto"
    this.encabezados= [ 
      { 
        'encabezado_1':'Codigo', 
        'encabezado_2':'Nombre',
        'encabezado_3':'Grupo'
      }]; 
    
    this.modal.open(this.content);
  }
  buscarVendedor() {
    this.opcion = 3;
    this.pedidoService.obtenerPedidos();
    this.title="Buscar Vendedor"
    this.encabezados= [ 
      { 
        'encabezado_1':'Codigo', 
        'encabezado_2':'Nombre',
        'encabezado_3':'Punto Venta'
      }]; 
    
    this.modal.open(this.content);
  }

}
