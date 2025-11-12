import { TestBed } from '@angular/core/testing';

import { AlertsMessagesService } from './alerts-messages.service';

describe('AlertsMessagesService', () => {
  let service: AlertsMessagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsMessagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
