import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.css']
})
export class ProviderListComponent implements OnInit {
  columns: IStandardColumn[] = [
     { name: 'name', format: 'link', link: (item) => '/provider/view/' + item._id },
     { name: 'email' },
     { name: 'address' },
    //  { name: 'registrationNumber' },
    //  { name: 'personInCharged', type: 'array' },
     { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' },
  ];
  filterList = [
     { type: 'name', queryType: 'string' },
     { type: 'email', queryType: 'string' },
     { type: 'address', queryType: 'string' },
    //  { type: 'registrationNumber', queryType: 'string' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
