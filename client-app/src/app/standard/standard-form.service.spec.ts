import { TestBed } from '@angular/core/testing';

import { StandardFormService } from './standard-form.service';

describe('StandardFormService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StandardFormService = TestBed.get(StandardFormService);
    expect(service).toBeTruthy();
  });
});
