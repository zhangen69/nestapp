import { IStandardFormField } from 'src/app/standard/standard.interface';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/templates/dialog-form/dialog-form.component';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

enum PaymentVoucherStatus {
  Open,
  Issued,
  Signed,
  Closed,
  Cancelled,
}

enum PaymentType {
  Cash,
  Cheque,
  BankTransfer,
}

@Component({
  selector: 'app-payment-voucher-form',
  templateUrl: './payment-voucher-form.component.html',
  styleUrls: ['./payment-voucher-form.component.css']
})
export class PaymentVoucherFormComponent implements OnInit {
  formData: any = {};
  callbackUrl: string;
  callbackFragment: string;
  includes = ['provider', 'receipt', 'eventPlan'];
  fields: IStandardFormField[] = [
    { name: 'provider', type: 'ref', required: true },
    { name: 'eventPlan', type: 'ref', required: true },
    { name: 'status', type: 'enum', enum: PaymentVoucherStatus, default: PaymentVoucherStatus[PaymentVoucherStatus.Open] },
    { name: 'paymentType', type: 'enum', enum: PaymentType, default: PaymentType[PaymentType.Cash] },
    { name: 'chequeInfo', type: 'object', isShow: item => item.paymentType === PaymentType[PaymentType.Cheque], fields: [
      { name: 'referenceNumber', type: 'string' },
      { name: 'payeeName', type: 'string' },
      { name: 'payeeIdentityNumber', type: 'string' },
      // { name: 'draweeName', type: 'string' },
      // { name: 'draweeIdentityNumber', type: 'string' },
      { name: 'issuedDate', type: 'date' },
    ]},
    { name: 'bankTransferInfo', type: 'object', isShow: item => item.paymentType === PaymentType[PaymentType.BankTransfer], fields: [
      { name: 'referenceNumber', type: 'string' },
      { name: 'bank', type: 'string' },
      { name: 'accountNumber', type: 'string' },
      { name: 'payeeName', type: 'string' },
      { name: 'payeeIdentityNumber', type: 'string' },
      { name: 'transferedDate', type: 'date' },
    ]},
    { name: 'remarks', type: 'textarea' },
    {
      name: 'lines',
      type: 'table',
      add: array => {
        this.addItem(array);
      },
      displayName: 'Payment Voucher Items',
      childName: 'Payment Voucher Item',
      default: [],
      fields: [
        { name: 'name', type: 'string', required: true },
        { name: 'unit', type: 'string', required: true },
        { name: 'unitPrice', type: 'number', required: true },
        { name: 'quantity', type: 'number', required: true }
      ]
    },
  ];

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private http: HttpClient, private router: Router, private location: Location) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['eventPlan']) {
        const getEventPlan$ = this.http.get<{ data }>(environment.apiUrl + '/service/event-plan/' + params['eventPlan']).subscribe({
          next: ({ data }) => {
            this.formData.eventPlan = data;
          },
          complete: () => {
            getEventPlan$.unsubscribe();
          }
        });
      }

      if (params['callback']) {
        this.callbackUrl = params['callback'];
      }

      if (params['fragment']) {
        this.callbackFragment = params['fragment'];
      }
    });
  }

  addItem(array) {
    const formData = { ...this.formData };

    if (!formData.provider) {
      alert('Please select a provider first!');
      return;
    }

    const queryModel = {
      type: 'provider',
      searchText: formData.provider._id,
      queryType: 'match'
    };

    const fields: IStandardFormField[] = [
      {
        name: 'service',
        displayName: 'Enter service name',
        type: 'ref',
        ref: 'provider-service',
        refIncludes: ['category'],
        queryModel: queryModel
      }
    ];

    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { fields, title: 'Add Service Item', callback: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }
      // do something here
      of(result)
        .pipe(
          map(item => {
            return [item.service, 'service'];
          })
        )
        .subscribe(([item, propName]) => {
          const line: any = { name: item.name, unit: item.unit, unitPrice: item.unitPrice };
          line[propName] = item;
          array.push(line);
        });
    });
  }
  
  redirectTo() {
    if (this.callbackUrl && this.callbackFragment) {
      this.router.navigate([this.callbackUrl], { fragment: this.callbackFragment });
    } else {
      if (window.history.length > 1) {
        this.location.back();
      } else {
        this.router.navigate(['/payment-voucher/list']);
      }
    }
  }
}
