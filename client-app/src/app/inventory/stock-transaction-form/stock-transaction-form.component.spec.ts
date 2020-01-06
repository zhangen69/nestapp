import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockTransactionFormComponent } from './stock-transaction-form.component';

describe('StockTransactionFormComponent', () => {
  let component: StockTransactionFormComponent;
  let fixture: ComponentFixture<StockTransactionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockTransactionFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockTransactionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
