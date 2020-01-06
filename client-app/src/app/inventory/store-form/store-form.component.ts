import { Component, OnInit } from '@angular/core';

enum StoreStatus {
  Available,
  Unavailable,
}

@Component({
  selector: 'app-store-form',
  templateUrl: './store-form.component.html',
  styleUrls: ['./store-form.component.css']
})
export class StoreFormComponent implements OnInit {
  fields = [
     { name: 'name', type: 'string', required: true },
     { name: 'status', type: 'enum', enum: StoreStatus, default: StoreStatus[StoreStatus.Available] },
     { name: 'description', type: 'string' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
