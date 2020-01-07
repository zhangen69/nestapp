import { IStandardFormField } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userFormFiels: IStandardFormField[] = [
    { name: 'username', type: 'string', displayName: 'User Name', required: true },
    { name: 'password', type: 'password', isShow: (item) => item._id, required: true },
    { name: 'displayName', type: 'string', required: true },
    { name: 'email', type: 'string', required: true },
    { name: 'phoneNumber', type: 'string', required: true },
  ];
  includes: string[] = [];

  constructor() { }

  ngOnInit() { }
}
