import { TestBed } from '@angular/core/testing';

import { StandardFunctionsService } from './standard-functions.service';

describe('StandardFunctionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandardFunctionsService = TestBed.get(StandardFunctionsService);
    expect(service).toBeTruthy();
  });
});
