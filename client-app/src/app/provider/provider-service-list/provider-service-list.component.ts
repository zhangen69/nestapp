import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-service-list',
  templateUrl: './provider-service-list.component.html',
  styleUrls: ['./provider-service-list.component.css']
})
export class ProviderServiceListComponent implements OnInit {
  includes = ['provider'];
  columns: IStandardColumn[] = [
    { name: 'provider.name', displayName: 'Provider', format: 'link', link: item => item.provider ? '/provider/view/' + item.provider._id : '' },
    { name: 'name' },
    { name: 'unit' },
    { name: 'unitPrice', displayName: 'U/Price (RM)', type: 'currency' },
    { name: 'description' },
    { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' }
  ];
  filterList = [
    { type: 'name', displayName: 'Name', queryType: 'string' },
    { type: 'description', displayName: 'Description', queryType: 'string' },
  ];

  constructor() {}

  ngOnInit() {}
}
