import { TestBed } from '@angular/core/testing';

import { NumeracionFacturacionService } from './numeracion-facturacion.service';

describe('NumeracionFacturacionService', () => {
  let service: NumeracionFacturacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumeracionFacturacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
