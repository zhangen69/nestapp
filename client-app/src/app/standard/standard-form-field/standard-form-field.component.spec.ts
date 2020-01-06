import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardFormFieldComponent } from './standard-form-field.component';

describe('StandardFormFieldComponent', () => {
  let component: StandardFormFieldComponent;
  let fixture: ComponentFixture<StandardFormFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StandardFormFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StandardFormFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
