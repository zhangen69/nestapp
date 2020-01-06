import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.css']
})
export class StoreListComponent implements OnInit {
  storeStatusEnumList = [];
  columns: IStandardColumn[] = [
     { name: 'name' },
     { name: 'description' },
     { name: 'status' },
     { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' },
  ];
  filterList = [
     { type: 'name', displayName: 'Name', queryType: 'string' },
     { type: 'status', displayName: 'Statups', queryType: 'string' },
  ];

  constructor() { }

  ngOnInit() {

  }

}
