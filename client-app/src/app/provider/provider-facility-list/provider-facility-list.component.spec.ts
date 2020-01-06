import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderFacilityListComponent } from './provider-facility-list.component';

describe('ProviderFacilityListComponent', () => {
  let component: ProviderFacilityListComponent;
  let fixture: ComponentFixture<ProviderFacilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderFacilityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderFacilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
