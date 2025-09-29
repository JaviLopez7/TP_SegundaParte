import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoProductosComponent } from './grafico-productos.component';

describe('GraficoProductosComponent', () => {
  let component: GraficoProductosComponent;
  let fixture: ComponentFixture<GraficoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
