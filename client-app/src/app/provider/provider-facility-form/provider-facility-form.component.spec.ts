import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFacilityFormComponent } from './provider-facility-form.component';

describe('ProviderFacilityFormComponent', () => {
  let component: ProviderFacilityFormComponent;
  let fixture: ComponentFixture<ProviderFacilityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderFacilityFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderFacilityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
