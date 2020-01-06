import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  columns: IStandardColumn[] = [
     { name: 'name', format: 'link', link: (item) => '/category/view/' + item._id },
     { name: 'type' },
     { name: 'remarks' },
     { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' },
  ];
  filterList = [
     { type: 'name', displayName: 'Name', queryType: 'string' },
     { type: 'type', displayName: 'Type', queryType: 'string' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
