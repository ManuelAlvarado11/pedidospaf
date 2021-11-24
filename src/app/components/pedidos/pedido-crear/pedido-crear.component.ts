import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmptyObject } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CnfCorrelativoPedidos } from 'src/app/models/cnfCorrelativoPedidos';
import { DetallePedido } from 'src/app/models/detallePedido';
import { numeracionFacturacion } from 'src/app/models/numeracionFacturacion';
import { Pedido } from 'src/app/models/pedido';
import { BodegaService } from 'src/app/services/bodega.service';
import { CorrelativoPedidosService } from 'src/app/services/correlativo-pedidos.service';
import { NumeracionFacturacionService } from 'src/app/services/numeracion-facturacion.service';
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
  detalle_pedidos: DetallePedido[] = [];
  total_pedido = 0;
  
  fecha_pedido = Date.now();
  dateNow : Date = new Date();
  dateNowISO = this.dateNow.toISOString();
  dateNowMilliseconds = this.dateNow.getTime();

  numPedido!: numeracionFacturacion;
  numDetalle!: numeracionFacturacion;
  corrPedido!: CnfCorrelativoPedidos;
  cot_empresa = "";cot_numero = "";numeroDetalle = "";
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
              public vendedorService:VendedorService,
              public numeracionFacturacionService: NumeracionFacturacionService,
              public correlativoPedidosService: CorrelativoPedidosService) { 
    //Declaracion de FormPedido
    this.formPedido = this.formBuilder.group({
      cot_fecha:['',[Validators.required,Validators.maxLength(10)]],
      cot_pedido:['',[Validators.required,Validators.maxLength(25)]],
      cot_vendedor: ['',[Validators.required,Validators.maxLength(25)]],
      cot_bodega: ['',[Validators.required,Validators.maxLength(25)]],
      cot_cliente: ['',[Validators.required,Validators.maxLength(25)]],
      cot_tipo_documento: ['',[Validators.required,Validators.maxLength(25)]],
      formDetalle: this.formBuilder.group({
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
      if(!isEmptyObject(data)){
        this.pedido=data;
        console.log(this.pedido)
        this.cot_empresa = this.pedido.cot_empresa;
        this.cot_numero = this.pedido.cot_numero;
        this.total_pedido = this.pedido.cot_total;
        this.detalle_pedidos = this.pedido.detalles;
        //this.fecha_pedido =this.pedido.cot_fecha;
        this.formPedido.patchValue({
          cot_pedido: this.pedido.cot_pedido,
          cot_fecha: this.pedido.cot_fecha,
          cot_bodega: this.pedido.cot_bodega,
          cot_vendedor: this.pedido.cot_vendedor,
          cot_cliente: this.pedido.cot_cliente,  
          cot_tipo_documento: this.pedido.cot_tipo_documento
        });

        console.log(this.formPedido)
      } 
    });
    
    //CARGAR CLIENTE
    this.pedidoService.obtenerCliente().subscribe(data => {
      if(!isEmptyObject(data)){
        this.formPedido.patchValue({
          cot_cliente: data.cli_codigo
        });
      }
    });

    //CARGAR PRODUCTO
    this.pedidoService.obtenerProducto().subscribe(data => { 
      if(!isEmptyObject(data)){
        this.formPedido.get('formDetalle')!.patchValue({
          dct_producto: data.pro_codigo
        });
      }
    });
    
    //CARGAR BODEGAS
    this.bodegaService.obtenerBodegas();

    //CARGAR VENDEDORES
    this.vendedorService.obtenerVendedores()

    //CARGAR TIPO DOCUMENTO
    this.tipoDocumentoService.obtenerTipoDocumentos()

    //CARGAR TIPO PRECIOS
    this.tipoPrecioService.obtenerTipoPrecios()
  
    //NUMERACION FACTURACION
    this.numeracionFacturacionService.obtenerNumeracion("fac_pedidos").subscribe(data => {
      this.numPedido = data;
      this.numPedido.num_numero = this.numPedido.num_numero + 1
    });
    this.numeracionFacturacionService.obtenerNumeracion("fac_detalle_pedidos").subscribe(data => {
      this.numDetalle = data;
    });
    this.correlativoPedidosService.obtenerCorrelativo("01").subscribe(data => {
      this.corrPedido = data;
      this.corrPedido.cnf_correlativos = (parseInt(this.corrPedido.cnf_correlativos) + 1).toString();
    });
    
  }
  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  guardarPedido(){
    if (this.cot_empresa == "" && this.cot_numero == ""){
      this.agregar();
    }else{
      this.editar();
    }
  }

  agregar(){
    const pedido: Pedido = {
      cot_empresa: this.userSesion.empresa,
      cot_numero: (this.numPedido.num_numero).toString(),
      cot_pedido: this.corrPedido.cnf_correlativos,
      cot_fecha: this.dateNow,
      cot_vendedor: this.formPedido.get('cot_vendedor')?.value,
      cot_bodega: this.formPedido.get('cot_bodega')?.value,
      cot_cliente: this.formPedido.get('cot_cliente')?.value,
      cot_tipo_documento: this.formPedido.get('cot_tipo_documento')?.value,
      cot_total: this.total_pedido,
      cot_anulada: false,
      detalles: this.detalle_pedidos
    }

    this.pedidoService.guardarPedido(pedido).subscribe(data => {
      this.toastr.success('Registro Agregado', 'Pedido Agregado Exitosamente');
      this.regresarListado();
    });

    //Actualizar llaves
    this.numeracionFacturacionService.actualizarNumeracion(this.numPedido).subscribe();
    this.numeracionFacturacionService.actualizarNumeracion(this.numDetalle).subscribe();
    this.correlativoPedidosService.actualizarCorrelativo(this.corrPedido).subscribe();

  }

  editar(){
    const pedido: Pedido = {
      cot_empresa: this.cot_empresa,
      cot_numero: this.cot_numero,
      cot_pedido: this.formPedido.get('cot_pedido')!.value,
      cot_fecha: this.formPedido.get('cot_fecha')!.value,
      cot_vendedor: this.formPedido.get('cot_vendedor')!.value,
      cot_bodega: this.formPedido.get('cot_bodega')!.value,
      cot_cliente: this.formPedido.get('cot_cliente')!.value,
      cot_tipo_documento: this.formPedido.get('cot_tipo_documento')!.value,
      cot_total: this.total_pedido,
      cot_anulada: false,
      detalles: this.detalle_pedidos
    }

    this.pedidoService.actualizarPedido(this.cot_empresa ,this.cot_numero ,pedido).subscribe(data => {
      this.toastr.info('Registro Modificado', 'Pedido Modificado Exitosamente');
      this.regresarListado();
    });
  }

  agregarDetalle(){
    //Incrementamos llave detalle
    this.numDetalle.num_numero = this.numDetalle.num_numero + 1;

    //Creamos nuevo detalle
    const detalle_pedido: DetallePedido={
      dct_empresa: this.userSesion.empresa,
      dct_cotizacion: (this.numPedido.num_numero).toString(),
      dct_numero_detalle: (this.numDetalle.num_numero).toString(),
      dct_producto: this.formPedido.get('formDetalle.dct_producto')!.value,
      dct_cantidad: this.formPedido.get('formDetalle.dct_cantidad')!.value,
      dct_tipo_precio: this.formPedido.get('formDetalle.dct_tipo_precio')!.value,
      dct_precio_lista:0,
      dct_precio_descuento: this.formPedido.get('formDetalle.dct_precio_descuento')!.value,
      dct_total: 0,
    }
    
    //Agregar detalle
    this.detalle_pedidos.push(detalle_pedido);
    this.calcularTotales();
    this.formPedido.get('formDetalle')!.reset();
  }

  eliminarDetalle(detalle: DetallePedido){
    let index = this.detalle_pedidos.indexOf(detalle);
    this.detalle_pedidos.splice(index,1);
    this.calcularTotales();
  }

  //Se valida por separado porque posee un formulario Interno de Detalle
  validarPedido(){
    let valido = false;
    if(

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
  calcularTotales(){
    let total = 0.00;
    for(let i=0; i< this.detalle_pedidos.length; i++){
      this.detalle_pedidos[i].dct_total = this.detalle_pedidos[i].dct_cantidad*this.detalle_pedidos[i].dct_precio_descuento;
      total = total + this.detalle_pedidos[i].dct_total;
    } 

    this.total_pedido = total;
  }

  regresarListado(){
    this.pedidoService.Cancelar();
    this.formPedido.reset();
    this.cot_empresa = "";this.cot_numero = "";this.numeroDetalle = "";
    this.pedidoService.obtenerPedidos();
    this.route.navigate(['/home/pedidos/listar']);
  }

}
