import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  columns: IStandardColumn[] = [
    { name: 'name', displayName: 'Name', format: 'link', link: (item) => '/customer/view/' + item._id },
    { name: 'email', displayName: 'Email' },
    { name: 'address', displayName: 'Address' },
    // { name: 'registrationNumber', displayName: 'Registration Number' },
    { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' },
  ];
  filterList = [
    { type: 'name', display: 'Name', queryType: 'string' },
    { type: 'email', display: 'Email', queryType: 'string' },
    { type: 'address', display: 'Address', queryType: 'string' },
    // { type: 'registrationNumber', display: 'Registration Number', queryType: 'string' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
