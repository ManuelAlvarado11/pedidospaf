import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoListarComponent } from './pedido-listar.component';

describe('PedidoListarComponent', () => {
  let component: PedidoListarComponent;
  let fixture: ComponentFixture<PedidoListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidoListarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
