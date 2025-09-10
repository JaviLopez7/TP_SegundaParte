import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCarritoComponent } from './factura-carrito.component';

describe('FacturaCarritoComponent', () => {
  let component: FacturaCarritoComponent;
  let fixture: ComponentFixture<FacturaCarritoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaCarritoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaCarritoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
