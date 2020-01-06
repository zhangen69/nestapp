import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-provider-form',
  templateUrl: './provider-form.component.html',
  styleUrls: ['./provider-form.component.css']
})
export class ProviderFormComponent implements OnInit {
  fields = [
     { name: 'name', type: 'string', required: true },
     { name: 'email', type: 'string', required: true },
     { name: 'address', type: 'textarea', required: true },
     { name: 'registrationNumber', type: 'string', required: true },
     { name: 'remarks', type: 'textarea' },
     { name: 'personInCharged', type: 'array', displayName: 'Person In Charged', childName: 'Person', fields: [
       { name: 'name', type: 'string', displayName: 'Name' },
       { name: 'jobTitle', type: 'string', displayName: 'Title/Position' },
       { name: 'email', type: 'string', displayName: 'Email' },
       { name: 'phoneNumber', type: 'string', displayName: 'Contact No.' },
     ]},
  ];

  constructor() { }

  ngOnInit() {
  }

}
