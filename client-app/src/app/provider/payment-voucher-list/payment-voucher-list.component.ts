import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-payment-voucher-list',
  templateUrl: './payment-voucher-list.component.html',
  styleUrls: ['./payment-voucher-list.component.css']
})
export class PaymentVoucherListComponent implements OnInit {
  includes = ['provider', 'receipt', 'eventPlan'];
  columns: IStandardColumn[] = [
    { name: 'code', width: '80px' },
    { name: 'provider.name', displayName: 'Provider', format: 'link', link: item => item.provider ? '/provider/view/' + item.provider._id : '' },
    { name: 'eventPlan.name', displayName: 'Event Plan', format: 'link', link: item => item.eventPlan ? '/event-plan/view/' + item.eventPlan._id : '' },
    { name: 'status', width: '80px' },
    { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' }
  ];
  filterList = [
    { type: 'code', displayName: 'Code', queryType: 'string' },
    { type: 'status', displayName: 'Status', queryType: 'string' },
  ];

  constructor() {}

  ngOnInit() {}
}
