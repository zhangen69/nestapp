import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardDisplayFieldComponent } from './standard-display-field.component';

describe('StandardDisplayFieldComponent', () => {
  let component: StandardDisplayFieldComponent;
  let fixture: ComponentFixture<StandardDisplayFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardDisplayFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardDisplayFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
