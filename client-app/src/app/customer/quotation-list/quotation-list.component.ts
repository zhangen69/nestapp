import { Component, OnInit } from '@angular/core';
import { IStandardColumn } from 'src/app/standard/standard.interface';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  styleUrls: ['./quotation-list.component.css']
})
export class QuotationListComponent implements OnInit {
  includes: string[] = ['customer', 'eventPlan'];
  columns: IStandardColumn[] = [
    { name: 'code', width: '80px' },
    { name: 'customer.name', displayName: 'Customer', width: '150px', format: 'link', link: item => '/customer/view/' + item.customer._id },
    { name: 'eventPlan.name', displayName: 'Event Plan', width: '150px', format: 'link', link: item => '/event-plan/view/' + item.eventPlan._id },
    { name: 'status', width: '80px' },
    { name: 'remarks' },
    { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' }
  ];
  filterList = [
    { type: 'code', displayName: 'Code', queryType: 'string' },
    { type: 'status', displayName: 'Status', queryType: 'string' },
  ];

  constructor() {}

  ngOnInit() {}
}
