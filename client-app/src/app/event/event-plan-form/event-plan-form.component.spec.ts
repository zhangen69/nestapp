import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlanFormComponent } from './event-plan-form.component';

describe('EventPlanFormComponent', () => {
  let component: EventPlanFormComponent;
  let fixture: ComponentFixture<EventPlanFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPlanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
