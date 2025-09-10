import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionProductoComponent } from './gestion-producto.component';

describe('GestionProductoComponent', () => {
  let component: GestionProductoComponent;
  let fixture: ComponentFixture<GestionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
