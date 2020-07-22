import { TestBed, inject } from '@angular/core/testing';

import { RecordMatchingService } from './record-matching.service';

describe('RecordMatchingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecordMatchingService]
    });
  });

  it('should be created', inject([RecordMatchingService], (service: RecordMatchingService) => {
    expect(service).toBeTruthy();
  }));
});
