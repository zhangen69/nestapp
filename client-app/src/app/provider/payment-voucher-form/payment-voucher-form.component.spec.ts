import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVoucherFormComponent } from './payment-voucher-form.component';

describe('PaymentVoucherFormComponent', () => {
  let component: PaymentVoucherFormComponent;
  let fixture: ComponentFixture<PaymentVoucherFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentVoucherFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVoucherFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
