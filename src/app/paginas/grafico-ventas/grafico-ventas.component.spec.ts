import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoVentasComponent } from './grafico-ventas.component';

describe('GraficoVentasComponent', () => {
  let component: GraficoVentasComponent;
  let fixture: ComponentFixture<GraficoVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
