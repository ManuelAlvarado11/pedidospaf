import { TestBed } from '@angular/core/testing';

import { TipoPrecioService } from './tipo-precio.service';

describe('TipoPrecioService', () => {
  let service: TipoPrecioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipoPrecioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
