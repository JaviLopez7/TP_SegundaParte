import { TestBed } from '@angular/core/testing';

import { ServicoTipoCambioService } from './servico-tipo-cambio.service';

describe('ServicoTipoCambioService', () => {
  let service: ServicoTipoCambioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicoTipoCambioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
