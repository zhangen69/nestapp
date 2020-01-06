import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceFormComponent } from './provider-service-form.component';

describe('ProviderServiceFormComponent', () => {
  let component: ProviderServiceFormComponent;
  let fixture: ComponentFixture<ProviderServiceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderServiceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderServiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
