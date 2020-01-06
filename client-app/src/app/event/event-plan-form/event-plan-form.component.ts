import { Component, OnInit } from '@angular/core';
import { IStandardFormField } from 'src/app/standard/standard.interface';

export enum EventPlanStatus {
  'Draft', 'Confirmed', 'Initial', 'Preparation', 'In Progress', 'Closed', 'Cancelled'
}

@Component({
  selector: 'app-event-plan-form',
  templateUrl: './event-plan-form.component.html',
  styleUrls: ['./event-plan-form.component.css']
})

export class EventPlanFormComponent implements OnInit {
  includes = ['customer'];
  fields: IStandardFormField[] = [
    { name: 'name', type: 'string', required: true },
    { name: 'customer', type: 'ref', required: true },
    { name: 'status', type: 'enum', enum: EventPlanStatus, default: EventPlanStatus[EventPlanStatus.Draft] },
    { name: 'dateFrom', type: 'date', required: true },
    { name: 'dateTo', type: 'date', required: true },
    { name: 'timeFrom', type: 'time', required: true },
    { name: 'timeTo', type: 'time', required: true },
    { name: 'venue', type: 'textarea-autocomplete', ref: 'event-plan/venue/list', refName: '', required: true },
    { name: 'markupRate', displayName: 'Markup Rate (%)', type: 'number', required: true },
    { name: 'remarks', type: 'textarea', displayName: 'Remarks' },
  ];

  constructor() { }

  ngOnInit() { }

}
