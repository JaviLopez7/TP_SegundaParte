import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoDolarComponent } from './grafico-dolar.component';

describe('GraficoDolarComponent', () => {
  let component: GraficoDolarComponent;
  let fixture: ComponentFixture<GraficoDolarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoDolarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraficoDolarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
