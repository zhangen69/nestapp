import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplierInvoiceListComponent } from './supplier-invoice-list.component';

describe('SupplierInvoiceListComponent', () => {
  let component: SupplierInvoiceListComponent;
  let fixture: ComponentFixture<SupplierInvoiceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SupplierInvoiceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SupplierInvoiceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
