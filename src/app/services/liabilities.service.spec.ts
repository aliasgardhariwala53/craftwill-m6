import { TestBed } from '@angular/core/testing';

import { LiabilitiesService } from './liabilities.service';

describe('LiabilitiesService', () => {
  let service: LiabilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiabilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
