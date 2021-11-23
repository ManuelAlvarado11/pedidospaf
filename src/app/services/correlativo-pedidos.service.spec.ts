import { TestBed } from '@angular/core/testing';

import { CorrelativoPedidosService } from './correlativo-pedidos.service';

describe('CorrelativoPedidosService', () => {
  let service: CorrelativoPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CorrelativoPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
