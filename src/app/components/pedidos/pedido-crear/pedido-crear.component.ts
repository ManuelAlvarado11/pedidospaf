import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder,FormArray,FormControl,Validators } from '@angular/forms';

@Component({
  selector: 'app-pedido-crear',
  templateUrl: './pedido-crear.component.html',
  styleUrls: ['./pedido-crear.component.css']
})
export class PedidoCrearComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { 
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
    console.log(this.form);
  }
}
