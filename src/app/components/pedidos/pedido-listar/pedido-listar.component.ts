import { Component, OnInit } from '@angular/core';
import { PedidoService } from 'src/app/services/pedido.service';

@Component({
  selector: 'app-pedido-listar',
  templateUrl: './pedido-listar.component.html',
  styleUrls: ['./pedido-listar.component.css']
})
export class PedidoListarComponent implements OnInit {

  constructor(public pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.pedidoService.obtenerPedidos();
  }

}
