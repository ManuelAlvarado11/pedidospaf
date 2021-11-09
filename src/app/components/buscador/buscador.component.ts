import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from 'src/app/services/pedido.service';
import { Buscador } from 'src/app/models/buscador';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ThrowStmt } from '@angular/compiler';


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
              public pedidoService: PedidoService,
              public clienteService: ClienteService,
              public productoService: ProductoService) { }

  buscarCliente() {
    this.opcion = 1;
    this.clienteService.obtenerClientes();
    this.title="Buscar Cliente"
    this.encabezados= [ 
      { 
        'encabezado_1':'Codigo', 
        'encabezado_2':'Nombre',
        'encabezado_3':'Registro'
      }]; 
    
    this.modal.open(this.content, { size: 'lg', backdrop: 'static' });
  }
  buscarProducto(){
    this.opcion = 2;
    this.productoService.obtenerProductos();
    this.title="Buscar Producto"
    this.encabezados= [ 
      { 
        'encabezado_1':'Codigo', 
        'encabezado_2':'Descripcion',
        'encabezado_3':'Grupo'
      }]; 
    
      this.modal.open(this.content, { size: 'lg', backdrop: 'static' });
  }

  seleccionar(item: any){
    switch (this.opcion){
      case 1:
        this.pedidoService.seleccionarCliente(item);
        this.modal.dismissAll();
        break;
      case 2:
        this.pedidoService.seleccionarProducto(item);
        this.modal.dismissAll();
        break;
    }
  }

}
