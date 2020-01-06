import { ToastrService } from 'ngx-toastr';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IStandardFormField } from 'src/app/standard/standard.interface';
import { Router } from '@angular/router';

enum TransactionType {
  StockIn,
  StockOut,
  Adjustment
}

@Component({
  selector: 'app-stock-transaction-form',
  templateUrl: './stock-transaction-form.component.html',
  styleUrls: ['./stock-transaction-form.component.css']
})
export class StockTransactionFormComponent implements OnInit {
  formData: any = {};
  includes: string[] = ['provider', 'customer', 'eventPlan', 'supplierInvoice', 'invoice'];
  fields: IStandardFormField[] = [
    { name: 'type', type: 'enum', enum: TransactionType, default: TransactionType[TransactionType.StockIn], required: true },
    { name: 'store', type: 'ref', required: true },
    { name: 'stockItem', type: 'ref', refIncludes: ['category'], required: true },
    { name: 'quantity', type: 'number', required: true },
    { name: 'receipt', type: 'ref', refName: 'code', isShow: (item) => item.type === TransactionType[TransactionType.StockIn] },
    { name: 'eventPlan', type: 'ref', isShow: (item) => item.type !== TransactionType[TransactionType.Adjustment] },
    { name: 'remarks', type: 'textarea' }
  ];

  constructor(private toastr: ToastrService, private http: HttpClient, private router: Router) {}

  ngOnInit() {}

  onSubmit(formData) {
    const newStockTransaction = Object.assign(
      {
        stockItemName: formData.stockItem.name,
        stockItemUnit: formData.stockItem.unit,
        stockItemUnitPrice: formData.stockItem.unitPrice,
        stockItemCategory: formData.stockItem.category
      },
      formData
    );
    const req$ = this.http.post(environment.apiUrl + '/service/stock-transaction', newStockTransaction).subscribe({
      next: () => {
        this.toastr.success('Stock Transaction is created');
        if (window.history.length > 0) {
          window.history.back()
        } else {
          this.router.navigate(['/stock-transaction/list']);
        }
      },
      complete: () => req$.unsubscribe()
    });
  }
}
