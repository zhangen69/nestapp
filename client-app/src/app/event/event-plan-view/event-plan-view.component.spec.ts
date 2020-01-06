import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPlanViewComponent } from './event-plan-view.component';

describe('EventPlanViewComponent', () => {
  let component: EventPlanViewComponent;
  let fixture: ComponentFixture<EventPlanViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPlanViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventPlanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
