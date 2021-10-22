import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Pedido } from 'src/app/models/pedido';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-crear',
  templateUrl: './pedido-crear.component.html',
  styleUrls: ['./pedido-crear.component.css']
})
export class PedidoCrearComponent implements OnInit {
  form: FormGroup;

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
  }

  guardarPedido(){
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
}
