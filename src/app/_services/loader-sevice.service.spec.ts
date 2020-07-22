import { TestBed, inject } from '@angular/core/testing';

import { LoaderSeviceService } from './loader-sevice.service';

describe('LoaderSeviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoaderSeviceService]
    });
  });

  it('should be created', inject([LoaderSeviceService], (service: LoaderSeviceService) => {
    expect(service).toBeTruthy();
  }));
});
