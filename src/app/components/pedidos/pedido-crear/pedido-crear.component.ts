import { DatePipe } from '@angular/common';
import { Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isEmptyObject } from 'jquery';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Bodega } from 'src/app/models/bodega';
import { DetallePedido } from 'src/app/models/detallePedido';
import { Pedido } from 'src/app/models/pedido';
import { BodegaService } from 'src/app/services/bodega.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { PreciosCantidadService } from 'src/app/services/precios-cantidad.service';
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
  gravada=0;iva = 0;exenta= 0;retencion=0;descuento=0;total = 0;
  cantidad_reserva=0; cantidad_existencia = 0; cantidad_disponible=0;

  cot_empresa = "";cot_numero = "";numeroDetalle = "";cot_vendedor = "";
  bodegaUser!: Bodega;
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  //Constructor
  constructor(private formBuilder: FormBuilder, 
              private toastr: ToastrService,
              private route: Router,
              public datepipe: DatePipe,
              private pedidoService: PedidoService,
              private productoService: ProductoService,
              public bodegaService:BodegaService,
              public tipoDocumentoService:TipoDocumentoService,
              public tipoPrecioService: TipoPrecioService,
              public vendedorService:VendedorService,
              public preciosCantidadService:PreciosCantidadService) { 
   
    //Declaracion de FormPedido
    this.formPedido = this.formBuilder.group({
      cot_fecha:['',[Validators.required,Validators.maxLength(10)]],
      cot_pedido:[''],
      cot_bodega: [''],
      cot_cliente: ['',[Validators.required,Validators.maxLength(25)]],
      cot_nombre:[''],
      cot_direccion :[''],
      cot_telefono :[''],
      cot_email :[''],
      cot_tamaño :[''],
      cot_exento :[0],
      cot_extranjero :[0],
      cot_tipo_documento: ['',[Validators.required,Validators.maxLength(25)]],
      cot_factura:[0],
      formDetalle: this.formBuilder.group({
        dct_producto: ['',[Validators.required,Validators.maxLength(25)]],
        dct_descripcion: [''],
        dct_bodega: [''],
        dct_cantidad: ['',[Validators.required,Validators.min(1)]],
        dct_tipo_precio: ['',[Validators.required]],
        dct_precio_lista: [0],
        dct_tipo_descuento: [''],
        dct_precio_descuento: [0,[Validators.required,Validators.min(0.01)]],
        dct_valor_lista: [0],
        dct_valor_descuento: [0],
        dct_gravada: [0],
        dct_exenta: [0],
        dct_iva: [0],
        dct_descuento: [0],
        dct_total: [0],
        dct_costo: [0],
        dct_tipo_registro: [''],
        dct_factor: [0],
      })
    });
  }

  ngOnInit(): void {
    //CARGAR PEDIDO
    this.pedidoService.obtenerPedido().subscribe(data => { 
      if(!isEmptyObject(data)){
        if(this.pedidoService.modo == 2){
          //MODO EDITAR
          this.formPedido.get('cot_pedido')?.disable();
        }else if(this.pedidoService.modo == 3){
          //MODO VER
          this.formPedido.disable();
        }

        this.pedido=data;
        this.cot_empresa = this.pedido.cot_empresa;
        this.cot_numero = this.pedido.cot_numero;
        this.cot_vendedor = this.pedido.cot_vendedor;
        this.gravada = this.pedido.cot_gravada;
        this.iva = this.pedido.cot_iva;
        this.exenta =this.pedido.cot_exenta;
        this.retencion = this.pedido.cot_retencion;
        this.descuento = this.pedido.cot_descuento;
        this.total= this.pedido.cot_total;
        this.detalle_pedidos = this.pedido.detalles;
       
        this.formPedido.patchValue({
          cot_pedido: this.pedido.cot_pedido,
          cot_fecha: this.datepipe.transform(this.pedido.cot_fecha, 'yyyy-MM-dd'),
          cot_bodega: this.pedido.cot_bodega,
          cot_cliente: this.pedido.cot_cliente,  
          cot_nombre: this.pedido.cot_nombre,
          cot_direccion: this.pedido.cot_direccion,
          cot_email: this.pedido.cot_email,
          cot_tamaño: this.pedido.cot_tamaño,
          cot_exento: this.pedido.cot_exento,
          cot_extranjero: this.pedido.cot_extranjero,
          cot_tipo_documento: this.pedido.cot_tipo_documento,
          cot_factura: this.pedido.cot_factura
        });
      }else{
        //DEFAULT
        this.formPedido.get('cot_pedido')?.disable();
        this.formPedido.patchValue({
          cot_fecha: this.datepipe.transform(Date.now(), 'yyyy-MM-dd'),
          cot_bodega: this.userSesion.confi.fac_puntos_venta.pvt_bodega,     
          cot_tipo_documento: 'FAC'     
        });
      } 
    });
    
    //CARGAR CLIENTE
    this.pedidoService.obtenerCliente().subscribe(data => {
      if(!isEmptyObject(data)){
        this.formPedido.patchValue({
          cot_cliente: data.cli_codigo,
          cot_nombre: data.cli_nombre,
          cot_direccion: data.cli_direccion,
          cot_telefono: data.cli_telefono,
          cot_email: data.cli_email,
          cot_tamaño: data.cli_tamaño,
          cot_exento: data.cli_exento,
          cot_extranjero: data.cli_extrangero
        });
      }
    });

    //CARGAR PRODUCTO
    this.pedidoService.obtenerProducto().subscribe(data => { 
      if(!isEmptyObject(data)){
        this.formPedido.get('formDetalle')!.patchValue({
          dct_producto: data.pro_codigo,
          dct_descripcion: data.pro_nombre,
          dct_cantidad:0.00,
          dct_factor: data.pro_factor,
          dct_tipo_precio: '0',
          dct_precio_descuento: 0.00 
        });
        this.limpiaCampos();
      }
    });
    
    //CARGAR BODEGAS
    this.bodegaService.obtenerBodegas();

    this.bodegaService.obtenerBodegaUser(this.userSesion.confi.fac_puntos_venta.pvt_bodega).subscribe(data => {
      this.bodegaUser = data;
      for(var i = 0; i < this.bodegaUser.fac_puntos_venta.fac_cnf_ptovta_cf2.length; i++){
        if(this.bodegaUser.fac_puntos_venta.fac_cnf_ptovta_cf2[i].cnf_codigo == "14 " && this.bodegaUser.fac_puntos_venta.fac_cnf_ptovta_cf2[i].cnf_activo == false ){
          this.formPedido.get('formDetalle.dct_tipo_precio')?.disable(); 
          this.formPedido.get('formDetalle.dct_precio_descuento')?.disable(); 
        }
      }
      
    });

    //CARGAR TIPO DOCUMENTO
    this.tipoDocumentoService.obtenerTipoDocumentos();

    //CARGAR TIPO PRECIOS
    this.tipoPrecioService.obtenerTipoPrecios();

    //CARGAR PRECIOS CANTIDAD
    this.preciosCantidadService.obtenerPreciosCantidad();
    
  }
  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    console.log('Saliste');
    this.regresarListado();
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
      cot_numero: "0",
      cot_pedido: "0",
      cot_fecha: this.formPedido.get('cot_fecha')?.value,
      cot_vendedor:this.userSesion.vendedor.vcn_codigo,
      cot_bodega: this.formPedido.get('cot_bodega')?.value,
      cot_cliente: this.formPedido.get('cot_cliente')?.value,
      cot_nombre: this.formPedido.get('cot_nombre')?.value,
      cot_direccion: this.formPedido.get('cot_direccion')?. value,
      cot_telefono: this.formPedido.get('cot_telefono')?.value,
      cot_email: this.formPedido.get('cot_email')?.value,
      cot_tamaño: this.formPedido.get('cot_tamaño')?.value,
      cot_exento: this.formPedido.get('cot_exento')?.value,
      cot_extranjero: this.formPedido.get('cot_extranjero')?.value,
      cot_tipo_documento: this.formPedido.get('cot_tipo_documento')?.value,
      cot_gravada: this.gravada,
      cot_iva:this.iva,
      cot_exenta:this.exenta,
      cot_retencion: this.retencion,
      cot_descuento: this.descuento,    
      cot_total: this.total,
      cot_anulada: false,
      cot_factura: "",
      detalles: this.detalle_pedidos
    }
   
    this.pedidoService.guardarPedido(pedido).subscribe(data => {
      this.toastr.success('Registro Agregado', 'Pedido Agregado Exitosamente');
      this.regresarListado();
    });

  }

  editar(){
    const pedido: Pedido = {
      cot_empresa: this.cot_empresa,
      cot_numero: this.cot_numero,
      cot_pedido: this.formPedido.get('cot_pedido')!.value,
      cot_fecha: this.formPedido.get('cot_fecha')!.value,
      cot_vendedor: this.cot_vendedor,
      cot_bodega: this.formPedido.get('cot_bodega')!.value,
      cot_cliente: this.formPedido.get('cot_cliente')!.value,
      cot_nombre: this.formPedido.get('cot_nombre')?.value,
      cot_direccion: this.formPedido.get('cot_direccion')?. value,
      cot_telefono: this.formPedido.get('cot_telefono')?.value,
      cot_email: this.formPedido.get('cot_email')?.value,
      cot_tamaño: this.formPedido.get('cot_tamaño')?.value,
      cot_exento: this.formPedido.get('cot_exento')?.value,
      cot_tipo_documento: this.formPedido.get('cot_tipo_documento')!.value,
      cot_gravada: this.gravada,
      cot_iva:this.iva,
      cot_exenta:this.exenta,
      cot_retencion: this.retencion,
      cot_descuento: this.descuento, 
      cot_total: this.total,
      cot_anulada: false,
      cot_factura: "",
      detalles: this.detalle_pedidos
    }

    this.pedidoService.actualizarPedido(this.cot_empresa ,this.cot_numero ,pedido).subscribe(data => {
      this.toastr.info('Registro Modificado', 'Pedido Modificado Exitosamente');
      this.regresarListado();
    });
  }

  agregarDetalle(){
    //Creamos nuevo detalle
    const detalle_pedido: DetallePedido={
      dct_empresa: this.userSesion.empresa,
      dct_cotizacion: "0",
      dct_numero_detalle: "0",
      dct_bodega: this.formPedido.get('cot_bodega')!.value,
      dct_producto: this.formPedido.get('formDetalle.dct_producto')!.value,
      dct_cantidad: this.formPedido.get('formDetalle.dct_cantidad')!.value,
      dct_descripcion: this.formPedido.get('formDetalle.dct_descripcion')!.value,
      dct_tipo_precio: this.formPedido.get('formDetalle.dct_tipo_precio')!.value,
      dct_precio_lista:this.formPedido.get('formDetalle.dct_precio_lista')!.value,
      dct_tipo_descuento: '',
      dct_precio_descuento: this.formPedido.get('formDetalle.dct_precio_descuento')!.value,
      dct_valor_lista: 0,
      dct_valor_descuento: 0,
      dct_gravada: 0,
      dct_exenta: 0,
      dct_iva: 0,
      dct_descuento: 0,
      dct_costo: 0,
      dct_total: 0,
      dct_tipo_registro : 'P',
      dct_factor: this.formPedido.get('formDetalle.dct_factor')!.value
    }
    
    //Agregar detalle
    this.detalle_pedidos.push(detalle_pedido);
    this.calcularTotales();
    this.formPedido.get('formDetalle')!.reset();
    this.limpiaCampos();
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
      this.formPedido.get('cot_cliente')!.valid &&
      this.formPedido.get('cot_tipo_documento')!.valid &&
      this.detalle_pedidos.length > 0
    ){
      valido = true;
    }
    return valido;
  }

  validarDetalle(){
    let valido = false;
    
    if(this.cantidad_disponible >= this.formPedido.get('formDetalle.dct_cantidad')!.value){
      valido = true;
    }
    return valido;
  }

  //PRECIO POR CANTIDAD
  cargarPrecioCantidad(e: any){
    let cantidad = e.target.value;
    let tipoSeleccionado = ''
    for(var i = 0; i < this.preciosCantidadService.list.length; i++){
      if(this.preciosCantidadService.list[i].ppc_min <= cantidad && this.preciosCantidadService.list[i].ppc_max >= cantidad){
        tipoSeleccionado =this.preciosCantidadService.list[i].ppc_tipo_precio;
      }
    }

    this.seleccionarPrecioCantidad(tipoSeleccionado)
    this.mostrarReserva();
    
  }

  seleccionarBodega(e:any){
    console.log(e);
  }

  seleccionarPrecioCantidad(tipoSeleccionado: string){
    let precio = 0.00;
   
    for(var i = 0; i < this.productoService.producto.fac_asignacion_precios.length; i++){
      let tipoPrecio = this.productoService.producto.fac_asignacion_precios[i].asp_tipo_precio;
      
      if(tipoSeleccionado == tipoPrecio){
        precio = this.productoService.producto.fac_asignacion_precios[i].asp_precio;
      }
    }

    this.formPedido.get('formDetalle')!.patchValue({
      dct_tipo_precio: tipoSeleccionado,
      dct_precio_lista: precio,
      dct_precio_descuento: precio
    });
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
      dct_precio_lista: precio,
      dct_precio_descuento: precio
    });
    
  }

  //Mostrar reserva
  mostrarReserva(){
    let existencia = 0;
   
    for(var i = 0; i < this.productoService.producto.fac_existencias_generales.length; i++){
      let bodega = this.productoService.producto.fac_existencias_generales[i].exc_bodega;
      if(bodega == "01"){
        existencia = this.productoService.producto.fac_existencias_generales[i].exc_existencia;
      }
    }
    this.cantidad_existencia = existencia;
    this.cantidad_reserva = this.productoService.cantidad_reserva;

    for(var i= 0; i < this.detalle_pedidos.length; i++){
      if(this.detalle_pedidos[i].dct_producto == this.formPedido.get('formDetalle.dct_producto')!.value && this.detalle_pedidos[i].dct_numero_detalle == "0" ){
        this.cantidad_reserva = this.cantidad_reserva+this.detalle_pedidos[i].dct_cantidad;
      }
    }
    this.cantidad_disponible = existencia - this.cantidad_reserva;
  }

  limpiaCampos(){
    this.cantidad_disponible = 0;
    this.cantidad_reserva = 0;
    this.cantidad_existencia = 0;
  }

  roundTo(num: number, places: number) {
    const factor = 10 ** places;
    return Math.round(num * factor) / factor;
  };

  //Operaciones aritmeticas
  calcularTotales(){
    let gravada=0.00,iva=0.00,exenta=0.00,retencion=0.00,descuento=0.00,total = 0.00;
    for(let i=0; i< this.detalle_pedidos.length; i++){
      this.detalle_pedidos[i].dct_valor_lista = this.roundTo(this.detalle_pedidos[i].dct_cantidad*this.detalle_pedidos[i].dct_precio_lista,2);
      this.detalle_pedidos[i].dct_valor_descuento =this.roundTo(this.detalle_pedidos[i].dct_cantidad*this.detalle_pedidos[i].dct_precio_descuento,2);

      // //DESCUENTO
      // if(this.detalle_pedidos[i].dct_valor_lista != this.detalle_pedidos[i].dct_valor_descuento){
      //   this.detalle_pedidos[i].dct_descuento = this.detalle_pedidos[i].dct_valor_lista - this.detalle_pedidos[i].dct_valor_descuento;
      // }else{
      //   this.detalle_pedidos[i].dct_descuento = 0;
      // }

      //CLIENTE EXENTO
      if(this.formPedido.get('cot_exento')?.value == 1){
        this.detalle_pedidos[i].dct_exenta = this.detalle_pedidos[i].dct_valor_descuento;
        this.detalle_pedidos[i].dct_gravada = 0;
        this.detalle_pedidos[i].dct_iva = 0;
      }else{
        //TIPO DOCUMENTO
        if (this.formPedido.get('cot_tipo_documento')!.value == 'FAC'){
          this.detalle_pedidos[i].dct_gravada = this.detalle_pedidos[i].dct_valor_descuento;
          this.detalle_pedidos[i].dct_iva = 0;
        }else{
          this.detalle_pedidos[i].dct_precio_lista = this.roundTo(this.detalle_pedidos[i].dct_precio_lista/1.13,2);
          this.detalle_pedidos[i].dct_gravada = this.roundTo(this.detalle_pedidos[i].dct_valor_descuento/1.13,2);
          this.detalle_pedidos[i].dct_iva = this.roundTo(this.detalle_pedidos[i].dct_gravada*0.13,2);
        }
        this.detalle_pedidos[i].dct_exenta = 0;
      }

      this.detalle_pedidos[i].dct_total = this.detalle_pedidos[i].dct_gravada + this.detalle_pedidos[i].dct_iva + this.detalle_pedidos[i].dct_exenta - this.detalle_pedidos[i].dct_descuento
      
      gravada = gravada + this.detalle_pedidos[i].dct_gravada;
      iva = iva + this.detalle_pedidos[i].dct_iva;
      exenta = exenta + this.detalle_pedidos[i].dct_exenta;
      descuento = descuento + this.detalle_pedidos[i].dct_descuento;
      total = total + this.detalle_pedidos[i].dct_total;
    } 

    this.gravada = gravada;
    this.iva = iva;
    this.exenta = exenta;
    this.retencion = retencion;
    this.descuento = descuento;
    this.total = total;
  }

  regresarListado(){
    this.pedidoService.Cancelar();
    this.formPedido.reset();
    this.cot_empresa = "";this.cot_numero = "";this.numeroDetalle = "";this.cot_vendedor = "";
    this.pedidoService.obtenerPedidos();
    this.route.navigate(['/home/pedidos/listar']);
  }

}
