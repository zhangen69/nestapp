import { environment } from 'src/environments/environment';
import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-stock-item-list',
  templateUrl: './stock-item-list.component.html',
  styleUrls: ['./stock-item-list.component.css']
})
export class StockItemListComponent implements OnInit {
  apiUrl = environment.apiUrl + '/service/stock-item-with-qty';
  includes: string[] = ['category', 'provider'];
  columns: IStandardColumn[] = [
    { name: 'name', format: 'link', link: (item) => '/stock-item/view/' + item._id },
    { name: 'category.name', displayName: 'Category' },
    { name: 'cost', displayName: 'Cost (RM)', type: 'currency' },
    { name: 'unit' },
    { name: 'unitPrice', displayName: 'U/Price (RM)', type: 'currency' },
    { name: 'quantity' },
    { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' }
  ];
  filterList = [{ type: 'name', display: 'Name', queryType: 'string' }];

  constructor() {}

  ngOnInit() {}
}
