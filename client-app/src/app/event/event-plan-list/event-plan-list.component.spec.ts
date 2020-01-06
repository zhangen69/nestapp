import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlanListComponent } from './event-plan-list.component';

describe('EventPlanListComponent', () => {
  let component: EventPlanListComponent;
  let fixture: ComponentFixture<EventPlanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPlanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
