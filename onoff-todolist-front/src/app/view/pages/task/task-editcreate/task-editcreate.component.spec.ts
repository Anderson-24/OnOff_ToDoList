import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskEditcreateComponent } from './task-editcreate.component';

describe('TaskEditcreateComponent', () => {
  let component: TaskEditcreateComponent;
  let fixture: ComponentFixture<TaskEditcreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskEditcreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskEditcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
