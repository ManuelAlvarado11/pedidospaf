import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-crear',
  templateUrl: './pedido-crear.component.html',
  styleUrls: ['./pedido-crear.component.css']
})
export class PedidoCrearComponent implements OnInit, OnDestroy {
  form: FormGroup;
  subscription!: Subscription;
  pedido!: Pedido;
  cot_empresa = "";cot_numero = "";cot_pedido="";


  constructor(private formBuilder: FormBuilder, 
              private pedidoService: PedidoService,
              private toastr: ToastrService) { 
    this.form = this.formBuilder.group({
      cot_empresa: ['',[Validators.required,Validators.maxLength(6)]],
      cot_numero: ['',[Validators.required,Validators.maxLength(10)]],
      cot_pedido: ['',[Validators.required,Validators.maxLength(6)]],
      cot_vendedor: ['',[Validators.required,Validators.maxLength(10)]],
      cot_bodega: ['',[Validators.required,Validators.maxLength(10)]],
      cot_cliente: ['',[Validators.required,Validators.maxLength(10)]],
      cot_total: [0.00,[Validators.required,Validators.max(500)]]
    });
  }

  ngOnInit(): void {
    this.pedidoService.obtenerPedido().subscribe(data => { 
      console.log(data); 
      this.pedido =data;
      this.form.patchValue({
        cot_empresa: this.pedido.cot_empresa,
        cot_numero: this.pedido.cot_numero,
        cot_pedido: this.pedido.cot_pedido,
        cot_vendedor: this.pedido.cot_vendedor,
        cot_cliente: this.pedido.cot_cliente,
        cot_total: this.pedido.cot_total,
        cot_bodega: this.pedido.cot_bodega,
      });
      this.cot_empresa = this.pedido.cot_empresa;
      this.cot_numero = this.pedido.cot_numero;
      this.cot_pedido = this.pedido.cot_pedido;
    });
    
  }
  
  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  guardarPedido(){
    if (this.cot_empresa == "" && this.cot_empresa == "" && this.cot_empresa == ""){
      this.agregar();
    }else{
      this.editar();
    }

  }

  agregar(){
    const pedido: Pedido = {
      cot_empresa: this.form.get('cot_empresa')!.value,
      cot_numero: this.form.get('cot_numero')!.value,
      cot_pedido: this.form.get('cot_pedido')!.value,
      cot_vendedor: this.form.get('cot_vendedor')!.value,
      cot_bodega: this.form.get('cot_bodega')!.value,
      cot_cliente: this.form.get('cot_cliente')!.value,
      cot_total: this.form.get('cot_total')!.value,
    }

    this.pedidoService.guardarPedido(pedido).subscribe(data => {
      this.toastr.success('Registro Agregado', 'Pedido Agregado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.form.reset();
    });
  }

  editar(){
    const pedido: Pedido = {
      cot_empresa: this.form.get('cot_empresa')!.value,
      cot_numero: this.form.get('cot_numero')!.value,
      cot_pedido: this.form.get('cot_pedido')!.value,
      cot_vendedor: this.form.get('cot_vendedor')!.value,
      cot_bodega: this.form.get('cot_bodega')!.value,
      cot_cliente: this.form.get('cot_cliente')!.value,
      cot_total: this.form.get('cot_total')!.value,
    }

    this.pedidoService.actualizarPedido(this.cot_empresa ,this.cot_empresa ,this.cot_empresa ,pedido).subscribe(data => {
      this.toastr.info('Registro Modificado', 'Pedido Modificado Exitosamente');
      this.pedidoService.obtenerPedidos();
      this.form.reset();
      this.cot_empresa = ""; this.cot_empresa = "" ;this.cot_empresa = "";
    });
  }

}
