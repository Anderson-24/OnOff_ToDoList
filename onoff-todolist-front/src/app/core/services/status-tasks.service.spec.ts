import { TestBed } from '@angular/core/testing';

import { StatusTasksService } from './status-tasks.service';

describe('StatusTasksService', () => {
  let service: StatusTasksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StatusTasksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
