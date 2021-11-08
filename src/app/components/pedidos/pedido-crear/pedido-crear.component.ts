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
  form: FormGroup;
  formDetalle: FormGroup;
  subscription!: Subscription;
  pedido!: Pedido;
  detalle_pedidos!: Detalle_pedido[];
  cot_empresa = "";cot_numero = "";cot_pedido="";
  userSesion = JSON.parse(localStorage.getItem('usuario')!);

  constructor(private formBuilder: FormBuilder, 
              private pedidoService: PedidoService,
              private toastr: ToastrService) { 
    this.form = this.formBuilder.group({
      cot_numero: ['',[Validators.required,Validators.maxLength(25)]],
      cot_pedido: ['',[Validators.required,Validators.maxLength(25)]],
      cot_vendedor: ['',[Validators.required,Validators.maxLength(25)]],
      cot_bodega: ['',[Validators.required,Validators.maxLength(25)]],
      cot_cliente: ['',[Validators.required,Validators.maxLength(25)]],
      cot_total: ['',[Validators.required,Validators.max(10000)]]   
    });

    this.formDetalle = this.formBuilder.group({
      dct_numero_detalle: ['',[Validators.required,Validators.maxLength(25)]],
      dct_producto: ['',[Validators.required,Validators.maxLength(25)]],
      dct_cantidad: ['',[Validators.required,Validators.max(10000)]],
      dct_precio_descuento: ['',[Validators.required,Validators.max(10000)]],
      dct_total: ['',[Validators.required,Validators.max(10000)]]
    });

    
  }

  ngOnInit(): void {
    this.pedidoService.obtenerPedido().subscribe(data => { 
      this.pedido =data;
      this.detalle_pedidos = [];
      this.form.patchValue({
        cot_numero: this.pedido.cot_numero,
        cot_pedido: this.pedido.cot_pedido,
        cot_bodega: this.pedido.cot_bodega,
        cot_vendedor: this.pedido.cot_vendedor,
        cot_cliente: this.pedido.cot_cliente,
        cot_total: this.pedido.cot_total
      });
      this.cot_empresa = this.pedido.cot_empresa;
      this.cot_numero = this.pedido.cot_numero;
      this.cot_pedido = this.pedido.cot_pedido;
    });
    
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
      cot_numero: this.form.get('cot_numero')!.value,
      cot_pedido: this.form.get('cot_pedido')!.value,
      cot_vendedor: this.form.get('cot_vendedor')!.value,
      cot_bodega: this.form.get('cot_bodega')!.value,
      cot_cliente: this.form.get('cot_cliente')!.value,
      cot_total: this.form.get('cot_total')!.value,
      cot_anulada: false,
      detalles: this.detalle_pedidos
    }

    this.pedidoService.guardarPedido(pedido).subscribe(data => {
      this.toastr.success('Registro Agregado', 'Pedido Agregado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.form.reset();
      this.formDetalle.reset();
    });
  }

  agregarDetalle(){
    const detalle_pedido: Detalle_pedido={
      dct_empresa: this.userSesion.empresa,
      dct_cotizacion: this.form.get('cot_numero')!.value,
      dct_numero_detalle: this.formDetalle.get('dct_numero_detalle')!.value,
      dct_producto: this.formDetalle.get('dct_producto')!.value,
      dct_cantidad: this.formDetalle.get('dct_cantidad')!.value,
      dct_precio_descuento: this.formDetalle.get('dct_precio_descuento')!.value,
      dct_total: this.formDetalle.get('dct_total')!.value,
    }

    console.log(detalle_pedido);
    this.detalle_pedidos.push(detalle_pedido);
    this.formDetalle.reset();
  }

  editar(){
    const pedido: Pedido = {
      cot_empresa: this.userSesion.empresa,
      cot_numero: this.form.get('cot_numero')!.value,
      cot_pedido: this.form.get('cot_pedido')!.value,
      cot_vendedor: this.form.get('cot_vendedor')!.value,
      cot_bodega: this.form.get('cot_bodega')!.value,
      cot_cliente: this.form.get('cot_cliente')!.value,
      cot_total: this.form.get('cot_total')!.value,
      cot_anulada: false,
      detalles: []
    }

    this.pedidoService.actualizarPedido(this.cot_empresa ,this.cot_empresa ,this.cot_empresa ,pedido).subscribe(data => {
      this.toastr.info('Registro Modificado', 'Pedido Modificado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.form.reset();
      this.formDetalle.reset();
      this.cot_empresa = ""; this.cot_empresa = "" ;this.cot_empresa = "";
    });
  }

}
