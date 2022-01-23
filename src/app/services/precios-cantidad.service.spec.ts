import { TestBed } from '@angular/core/testing';

import { PreciosCantidadService } from './precios-cantidad.service';

describe('PreciosCantidadService', () => {
  let service: PreciosCantidadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreciosCantidadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
