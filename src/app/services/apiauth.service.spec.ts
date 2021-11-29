import { TestBed } from '@angular/core/testing';

import { ApiauthService } from './apiauth.service';

describe('ApiauthService', () => {
  let service: ApiauthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiauthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
