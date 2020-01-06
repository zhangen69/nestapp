import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProviderServiceListComponent } from './provider-service-list.component';

describe('ProviderServiceListComponent', () => {
  let component: ProviderServiceListComponent;
  let fixture: ComponentFixture<ProviderServiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderServiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderServiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
