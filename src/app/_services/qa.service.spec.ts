import { TestBed, inject } from '@angular/core/testing';

import { QaService } from './qa.service';

describe('QaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QaService]
    });
  });

  it('should be created', inject([QaService], (service: QaService) => {
    expect(service).toBeTruthy();
  }));
});
