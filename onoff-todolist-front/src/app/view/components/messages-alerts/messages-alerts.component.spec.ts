import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesAlertsComponent } from './messages-alerts.component';

describe('MessagesAlertsComponent', () => {
  let component: MessagesAlertsComponent;
  let fixture: ComponentFixture<MessagesAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessagesAlertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MessagesAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
