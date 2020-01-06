import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportAttendeesComponent } from './import-attendees.component';

describe('ImportAttendeesComponent', () => {
  let component: ImportAttendeesComponent;
  let fixture: ComponentFixture<ImportAttendeesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportAttendeesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportAttendeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
