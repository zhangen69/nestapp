import { Component, OnInit } from '@angular/core';
import { IStandardFormField, StandardHttpResponse } from 'src/app/standard/standard.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';

enum PaymentStatus {
  Open,
  Verified,
  Cancelled,
  Failed,
  Closed
}

enum PaymentType {
  Cash,
  Cheque,
  BankTransfer,
}

enum PaymentForType {
  Customer,
  Provider,
}

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit {
  formData: any = {};
  paidAmount = 0;
  outstandingAmount = 0;
  includes: string[] = ['provider', 'customer', 'eventPlan', 'supplierInvoice', 'invoice'];
  fields: IStandardFormField[] = [
    { name: 'eventPlan', type: 'ref', required: true },
    { name: 'type', type: 'enum', enum: PaymentForType, default: null, required: true },
    { name: 'provider', type: 'ref', isShow: item => item.type === PaymentForType[PaymentForType.Provider], required: true },
    { name: 'customer', type: 'ref', isShow: item => item.type === PaymentForType[PaymentForType.Customer], required: true },
    { name: 'supplierInvoice', type: 'ref', refName: 'code', isShow: item => item.type === PaymentForType[PaymentForType.Provider], required: true },
    { name: 'invoice', type: 'ref', refName: 'code', isShow: item => item.type === PaymentForType[PaymentForType.Customer], required: true },
    { name: 'status', type: 'enum', enum: PaymentStatus, default: PaymentStatus[PaymentStatus.Open] },
    { name: 'amount', type: 'number', max: (item) => {
      if (item.invoice || item.supplierInvoice) {
        return this.outstandingAmount - this.paidAmount;
      }
      return false;
    }, required: true },
    { name: 'paymentType', type: 'enum', enum: PaymentType, default: PaymentType[PaymentType.Cash] },
    { name: 'chequeInfo', type: 'object', isShow: item => item.paymentType === PaymentType[PaymentType.Cheque], fields: [
      { name: 'referenceNumber', type: 'string', required: true },
      { name: 'payeeName', type: 'string', required: true },
      { name: 'payeeIdentityNumber', type: 'string', required: true },
      // { name: 'draweeName', type: 'string', required: true },
      // { name: 'draweeIdentityNumber', type: 'string', required: true },
      { name: 'issuedDate', type: 'date', required: true },
    ]},
    { name: 'bankTransferInfo', type: 'object', isShow: item => item.paymentType === PaymentType[PaymentType.BankTransfer], fields: [
      { name: 'referenceNumber', type: 'string', required: true },
      { name: 'bank', type: 'string', required: true },
      { name: 'accountNumber', type: 'string', required: true },
      { name: 'payeeName', type: 'string', required: true },
      { name: 'payeeIdentityNumber', type: 'string', required: true },
      { name: 'transferedDate', type: 'date', required: true },
    ]},
    { name: 'remarks', type: 'textarea' },
  ];
  callbackUrl: string;
  callbackFragment: string;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private location: Location) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['eventPlan']) {
        const getEventPlan$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/event-plan/' + params['eventPlan']).subscribe({
          next: ({ data }) => {
            this.formData.eventPlan = data;
          },
          complete: () => {
            getEventPlan$.unsubscribe();
          }
        });
      }
      if (params['provider']) {
        const getEventPlan$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/provider/' + params['provider']).subscribe({
          next: ({ data }) => {
            this.formData.type = PaymentForType[PaymentForType.Provider];
            this.formData.provider = data;
          },
          complete: () => {
            getEventPlan$.unsubscribe();
          }
        });
      }
      if (params['supplierInvoice']) {
        const getEventPlan$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/supplier-invoice/' + params['supplierInvoice']).subscribe({
          next: ({ data }) => {
            this.formData.type = PaymentForType[PaymentForType.Provider];
            this.formData.supplierInvoice = data;
          },
          complete: () => {
            getEventPlan$.unsubscribe();
          }
        });
        const paymentQueryModel = {
          searchText: params['supplierInvoice'],
          type: 'supplierInvoice',
          queryType: 'match'
        };
        const getSupplierInvoicePayments$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/payment?queryModel=' + JSON.stringify(paymentQueryModel)).subscribe({
          next: ({ data }) => {
            this.paidAmount = data.filter(item => item.status === 'Verified' || item.status === 'Closed').reduce((acc, item) => acc + item.amount, 0);
          },
          complete: () => {
            getSupplierInvoicePayments$.unsubscribe();
          }
        });
      }
      if (params['customer']) {
        const getEventPlan$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/customer/' + params['customer']).subscribe({
          next: ({ data }) => {
            this.formData.type = PaymentForType[PaymentForType.Customer];
            this.formData.customer = data;
          },
          complete: () => {
            getEventPlan$.unsubscribe();
          }
        });
      }
      if (params['invoice']) {
        const getEventPlan$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/invoice/' + params['invoice']).subscribe({
          next: ({ data }) => {
            this.formData.type = PaymentForType[PaymentForType.Customer];
            this.formData.invoice = data;
          },
          complete: () => {
            getEventPlan$.unsubscribe();
          }
        });
        const paymentQueryModel = {
          searchText: params['invoice'],
          type: 'invoice',
          queryType: 'match'
        };
        const getInvoicePayments$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/payment?queryModel=' + JSON.stringify(paymentQueryModel)).subscribe({
          next: ({ data }) => {
            this.paidAmount = data.filter(item => item.status === 'Verified' || item.status === 'Closed').reduce((acc, item) => acc + item.amount, 0);
          },
          complete: () => {
            getInvoicePayments$.unsubscribe();
          }
        });
      }
      if (params['amount']) {
        this.outstandingAmount = Number(params.amount);
        this.formData.amount = Number(Number(params['amount']).toFixed(2));
      }
      if (params['remarks']) {
        this.formData.remarks = params['remarks'];
      }
      if (params['callback']) {
        this.callbackUrl = params['callback'];
      }
      if (params['fragment']) {
        this.callbackFragment = params['fragment'];
      }
    });
  }

  redirectTo() {
    if (this.callbackUrl && this.callbackFragment) {
      this.router.navigate([this.callbackUrl], { fragment: this.callbackFragment });
    } else {
      if (window.history.length > 1) {
        this.location.back();
      } else {
        this.router.navigate(['/payment/list']);
      }
    }
  }
}
