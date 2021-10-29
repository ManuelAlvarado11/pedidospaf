import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Detalle_pedido } from 'src/app/models/detalle_pedido';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-crear',
  templateUrl: './pedido-crear.component.html',
  styleUrls: ['./pedido-crear.component.css']
})

export class PedidoCrearComponent implements OnInit, OnDestroy {
  
  //Inicializacion de variables
  formPedido: FormGroup;
  formDetalle: FormGroup;
  subscription!: Subscription;
  pedido!: Pedido;
  detalle_pedidos!: Detalle_pedido[];
  cot_empresa = "";cot_numero = "";cot_pedido="";

  //Contructor PedidoCrearComponent
  constructor(private formBuilder: FormBuilder, private pedidoService: PedidoService,private toastr: ToastrService) { 
    
    this.formPedido = this.formBuilder.group({
      cot_empresa: ['',[Validators.required,Validators.maxLength(25)]],
      cot_numero: ['',[Validators.required,Validators.maxLength(25)]],
      cot_pedido: ['',[Validators.required,Validators.maxLength(25)]],
      cot_vendedor: ['',[Validators.required,Validators.maxLength(25)]],
      cot_bodega: ['',[Validators.required,Validators.maxLength(25)]],
      cot_cliente: ['',[Validators.required,Validators.maxLength(25)]],
      cot_gravada: ['',[Validators.required,Validators.min(0)]],
      cot_iva: ['',[Validators.required,Validators.min(0)]],
      cot_exenta: ['',[Validators.required,Validators.min(0)]],
      cot_retencion: ['',[Validators.required,Validators.min(0)]],
      cot_descuento: ['',[Validators.required,Validators.min(0)]],
      cot_total: ['',[Validators.required,Validators.min(0)]]   
    });

    this.formDetalle = this.formBuilder.group({
      dct_empresa: ['',[Validators.required,Validators.maxLength(25)]],
      dct_numero_detalle: ['',[Validators.required,Validators.maxLength(25)]],
      dct_cotizacion: ['',[Validators.required,Validators.maxLength(25)]],
      dct_producto: ['',[Validators.required,Validators.maxLength(25)]],
      dct_cantidad: ['',[Validators.required,Validators.min(0)]],
      dct_precio_descuento: ['',[Validators.required,Validators.min(0)]],
      dct_gravada: ['',[Validators.required,Validators.min(0)]],
      dct_exenta: ['',[Validators.required,Validators.min(0)]],
      dct_iva: ['',[Validators.required,Validators.min(0)]],
      dct_descuento: ['',[Validators.required,Validators.min(0)]],
      dct_total: ['',[Validators.required,Validators.min(0)]],
      dct_costo: ['',[Validators.required,Validators.min(0)]]      
    });
  }

  ngOnInit(): void {
    //Cargar pedido en Formulario
    this.pedidoService.obtenerPedido().subscribe(data => { 
      this.pedido =data;
      this.detalle_pedidos = this.pedido.detalles;
      this.formPedido.patchValue({
        cot_empresa: this.pedido.cot_empresa,
        cot_numero: this.pedido.cot_numero,
        cot_pedido: this.pedido.cot_pedido,
        cot_vendedor: this.pedido.cot_vendedor,
        cot_cliente: this.pedido.cot_cliente,
        cot_total: this.pedido.cot_total,
        cot_bodega: this.pedido.cot_bodega,
      });

      //Obtener Llave Pedido
      this.cot_empresa = this.pedido.cot_empresa;
      this.cot_numero = this.pedido.cot_numero;
      this.cot_pedido = this.pedido.cot_pedido;
    });
    
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
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
      cot_empresa: this.formPedido.get('cot_empresa')!.value,
      cot_numero: this.formPedido.get('cot_numero')!.value,
      cot_pedido: this.formPedido.get('cot_pedido')!.value,
      cot_vendedor: this.formPedido.get('cot_vendedor')!.value,
      cot_bodega: this.formPedido.get('cot_bodega')!.value,
      cot_cliente: this.formPedido.get('cot_cliente')!.value,
      cot_gravada: 0,
      cot_iva: 0,
      cot_exenta: 0,
      cot_retencion: 0,
      cot_descuento: 0,
      cot_total: this.formPedido.get('cot_total')!.value,
      cot_anulada: false,
      detalles: this.detalle_pedidos
    }
    console.log(pedido);
    this.pedidoService.guardarPedido(pedido).subscribe(data => {
      this.toastr.success('Registro Agregado', 'Pedido Agregado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.formPedido.reset();
    });
  }

  editar(){
    const pedido: Pedido = {
      cot_empresa: this.formPedido.get('cot_empresa')!.value,
      cot_numero: this.formPedido.get('cot_numero')!.value,
      cot_pedido: this.formPedido.get('cot_pedido')!.value,
      cot_vendedor: this.formPedido.get('cot_vendedor')!.value,
      cot_bodega: this.formPedido.get('cot_bodega')!.value,
      cot_cliente: this.formPedido.get('cot_cliente')!.value,
      cot_gravada: 0,
      cot_iva: 0,
      cot_exenta: 0,
      cot_retencion: 0,
      cot_descuento: 0,
      cot_total: this.formPedido.get('cot_total')!.value,
      cot_anulada: false,
      detalles: []
    }

    this.pedidoService.actualizarPedido(this.cot_empresa ,this.cot_empresa ,this.cot_empresa ,pedido).subscribe(data => {
      this.toastr.info('Registro Modificado', 'Pedido Modificado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.formPedido.reset();
      this.cot_empresa = ""; this.cot_empresa = "" ;this.cot_empresa = "";
    });
  }

  agregarDetalle(){
    this.detalle_pedidos.push(this.formDetalle.value);
    this.formDetalle.reset();
  }

}
