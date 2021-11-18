import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DetallePedido } from 'src/app/models/detallePedido';
import { Pedido } from 'src/app/models/pedido';
import { Producto } from 'src/app/models/producto';
import { BodegaService } from 'src/app/services/bodega.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ProductoService } from 'src/app/services/producto.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { TipoPrecioService } from 'src/app/services/tipo-precio.service';
import { VendedorService } from 'src/app/services/vendedor.service';


@Component({
  selector: 'app-pedido-crear',
  templateUrl: './pedido-crear.component.html',
  styleUrls: ['./pedido-crear.component.css']
})
export class PedidoCrearComponent implements OnInit, OnDestroy {
  //Variables
  formPedido: FormGroup;
  subscription!: Subscription;
  pedido!: Pedido;
  detalle_pedidos!: DetallePedido[];
  total_pedido = 0;
  producto_seleccionado!: Producto;
  pro_codigo_seleccionado= "";
  cot_empresa = "";cot_numero = "";cot_pedido="";
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  //Constructor
  constructor(private formBuilder: FormBuilder, 
              private toastr: ToastrService,
              private route: Router,
              private pedidoService: PedidoService,
              private productoService: ProductoService,
              public bodegaService:BodegaService,
              public tipoDocumentoService:TipoDocumentoService,
              public tipoPrecioService: TipoPrecioService,
              public vendedorService:VendedorService) { 
    //Declaracion de FormPedido
    this.formPedido = this.formBuilder.group({
      cot_numero: ['',[Validators.required,Validators.maxLength(25)]],
      cot_pedido: ['',[Validators.required,Validators.maxLength(25)]],
      cot_vendedor: ['',[Validators.required,Validators.maxLength(25)]],
      cot_bodega: ['',[Validators.required,Validators.maxLength(25)]],
      cot_cliente: ['',[Validators.required,Validators.maxLength(25)]],
      cot_tipo_documento: ['',[Validators.required,Validators.maxLength(25)]],
      formDetalle: this.formBuilder.group({
        dct_numero_detalle: ['',[Validators.required,Validators.maxLength(25)]],
        dct_producto: ['',[Validators.required,Validators.maxLength(25)]],
        dct_cantidad: ['',[Validators.required,Validators.max(10000)]],
        dct_tipo_precio: ['',[Validators.required,Validators.max(10000)]],
        dct_precio_descuento: ['',[Validators.required,Validators.max(10000)]]
      })
    });
  }

  ngOnInit(): void {
    //CARGAR PEDIDO
    this.pedidoService.obtenerPedido().subscribe(data => { 
      this.pedido =data;
      this.detalle_pedidos = [];
      this.formPedido.patchValue({
        cot_numero: this.pedido.cot_numero,
        cot_pedido: this.pedido.cot_pedido,
        cot_bodega: this.pedido.cot_bodega,
        cot_vendedor: this.pedido.cot_vendedor,
        cot_cliente: this.pedido.cot_cliente,
        cot_tipo_documento: this.pedido.cot_tipo_documento
      });
      this.cot_empresa = this.pedido.cot_empresa;
      this.cot_numero = this.pedido.cot_numero;
      this.cot_pedido = this.pedido.cot_pedido;
    });
    
    //CARGAR CLIENTE
    this.pedidoService.obtenerCliente().subscribe(data => {
      this.formPedido.patchValue({
        cot_cliente: data.cli_codigo
      });
    });

    //CARGAR PRODUCTO
    this.pedidoService.obtenerProducto().subscribe(data => { 
      this.formPedido.get('formDetalle')!.patchValue({
        dct_producto: data
      });
    });
    

    //CARGAR BODEGAS
    this.bodegaService.obtenerBodegas();

    //CARGAR VENDEDORES
    this.vendedorService.obtenerVendedores()

    //CARGAR TIPO DOCUMENTO
    this.tipoDocumentoService.obtenerTipoDocumentos()

    //CARGAR TIPO PRECIOS
    this.tipoPrecioService.obtenerTipoPrecios()
  
  }
  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  guardarPedido(){
    // if (this.cot_empresa == "" && this.cot_empresa == "" && this.cot_empresa == ""){
    //   this.agregar();
    // }else{
    //   this.editar();
    // }
    this.agregar();
  }

  agregar(){
    const pedido: Pedido = {
      cot_empresa: this.userSesion.empresa,
      cot_numero: this.formPedido.get('cot_numero')!.value,
      cot_pedido: this.formPedido.get('cot_pedido')!.value,
      cot_vendedor: this.formPedido.get('cot_vendedor')!.value,
      cot_bodega: this.formPedido.get('cot_bodega')!.value,
      cot_cliente: this.formPedido.get('cot_cliente')!.value,
      cot_tipo_documento: this.formPedido.get('cot_tipo_documento')!.value,
      cot_total: this.total_pedido,
      cot_anulada: false,
      detalles: this.detalle_pedidos
    }
    console.log(pedido);
    this.pedidoService.guardarPedido(pedido).subscribe(data => {
      this.toastr.success('Registro Agregado', 'Pedido Agregado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.formPedido.reset();
      this.route.navigate(['/home/pedidos/listar']);
    });
  }

  agregarDetalle(){
    const detalle_pedido: DetallePedido={
      dct_empresa: this.userSesion.empresa,
      dct_cotizacion: this.formPedido.get('cot_numero')!.value,
      dct_numero_detalle: this.formPedido.get('formDetalle.dct_numero_detalle')!.value,
      dct_producto: this.formPedido.get('formDetalle.dct_producto')!.value,
      dct_cantidad: this.formPedido.get('formDetalle.dct_cantidad')!.value,
      dct_tipo_precio: this.formPedido.get('formDetalle.dct_tipo_precio')!.value,
      dct_precio_lista:0,
      dct_precio_descuento: this.formPedido.get('formDetalle.dct_precio_descuento')!.value,
      dct_total: 0,
    }

    console.log(detalle_pedido);
    this.calcularTotales(detalle_pedido);
    this.detalle_pedidos.push(detalle_pedido);
    this.formPedido.get('formDetalle')!.reset();
  }

  editar(){
    const pedido: Pedido = {
      cot_empresa: this.userSesion.empresa,
      cot_numero: this.formPedido.get('cot_numero')!.value,
      cot_pedido: this.formPedido.get('cot_pedido')!.value,
      cot_vendedor: this.formPedido.get('cot_vendedor')!.value,
      cot_bodega: this.formPedido.get('cot_bodega')!.value,
      cot_cliente: this.formPedido.get('cot_cliente')!.value,
      cot_tipo_documento: this.formPedido.get('cot_tipo_documento')!.value,
      cot_total: this.total_pedido,
      cot_anulada: false,
      detalles: this.detalle_pedidos
    }

    this.pedidoService.actualizarPedido(this.cot_empresa ,this.cot_empresa ,this.cot_empresa ,pedido).subscribe(data => {
      this.toastr.info('Registro Modificado', 'Pedido Modificado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.formPedido.reset();
      this.cot_empresa = ""; this.cot_empresa = "" ;this.cot_empresa = "";
    });
  }

  //Se valida por separado porque posee un formulario Interno de Detalle
  validarPedido(){
    let valido = false;
    if(
      this.formPedido.get('cot_numero')!.valid &&
      this.formPedido.get('cot_pedido')!.valid &&
      this.formPedido.get('cot_bodega')!.valid &&
      this.formPedido.get('cot_vendedor')!.valid &&
      this.formPedido.get('cot_cliente')!.valid &&
      this.formPedido.get('cot_tipo_documento')!.valid &&
      this.detalle_pedidos.length > 0
    ){
      valido = true;
    }
    return valido;
  }

  //Al elegir tipo de precio
  seleccionarPrecio(e: any) {
    let tipoSeleccionado = e.target.value;
    let precio = 0.00;
   
    for(var i = 0; i < this.productoService.producto.fac_asignacion_precios.length; i++){
      let tipoPrecio = this.productoService.producto.fac_asignacion_precios[i].asp_tipo_precio;
      
      if(tipoSeleccionado == tipoPrecio){
        precio = this.productoService.producto.fac_asignacion_precios[i].asp_precio;
      }
    }

    this.formPedido.get('formDetalle')!.patchValue({
      dct_precio_descuento: precio
    });
  }

  //Operaciones aritmeticas
  calcularTotales(detalle: DetallePedido){
    detalle.dct_total = detalle.dct_cantidad*detalle.dct_precio_descuento;
    this.total_pedido = this.total_pedido + detalle.dct_total;
 }

}
