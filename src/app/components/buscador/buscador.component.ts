import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PedidoService } from 'src/app/services/pedido.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProductoService } from 'src/app/services/producto.service';



@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit{
  @ViewChild("content") content: any;
  @Input() title = "";
  opcion = 0;
  encabezados= [] as any;
  dtOptions: DataTables.Settings = {};

  constructor(private modal: NgbModal, 
              public pedidoService: PedidoService,
              public clienteService: ClienteService,
              public productoService: ProductoService) { }
              
  ngOnInit(): void {
    
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      columns: [{ data: 'id' }, { data: 'firstName' }, { data: 'lastName' }],
    };
    
  }

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
        this.productoService.obtenerProducto(item);
        this.modal.dismissAll();
        break;
    }
  }

}
