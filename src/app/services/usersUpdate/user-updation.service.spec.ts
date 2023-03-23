import { TestBed } from '@angular/core/testing';

import { UserUpdationService } from './user-updation.service';

describe('UserUpdationService', () => {
  let service: UserUpdationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserUpdationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
