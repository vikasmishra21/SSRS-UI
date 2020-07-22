import { TestBed, inject } from '@angular/core/testing';

import { PoReturnsService } from './po-returns.service';

describe('PoReturnsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PoReturnsService]
    });
  });

  it('should be created', inject([PoReturnsService], (service: PoReturnsService) => {
    expect(service).toBeTruthy();
  }));
});
