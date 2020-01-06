import { Component, OnInit } from '@angular/core';

enum CategoryType {
  Facility,
  Service
}

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  fields = [
     { name: 'name', type: 'string', required: true },
     { name: 'type', type: 'enum', enum: CategoryType, default: CategoryType[CategoryType.Facility], required: true },
    //  { name: 'category', type: 'ref' },
     { name: 'remarks', type: 'textarea' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
