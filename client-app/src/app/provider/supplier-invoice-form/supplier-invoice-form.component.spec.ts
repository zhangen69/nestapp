import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInvoiceFormComponent } from './supplier-invoice-form.component';

describe('SupplierInvoiceFormComponent', () => {
  let component: SupplierInvoiceFormComponent;
  let fixture: ComponentFixture<SupplierInvoiceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierInvoiceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
