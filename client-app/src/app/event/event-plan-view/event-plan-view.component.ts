import { Title } from '@angular/platform-browser';
import { ImportAttendeesComponent } from './import-attendees/import-attendees.component';
import { StandardHttpResponse, IStandardFormField, IStandardColumn } from './../../standard/standard.interface';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { PageLoaderService } from 'src/app/templates/page-loader/page-loader.service';
import { StandardService } from 'src/app/standard/standard.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DialogFormComponent } from 'src/app/templates/dialog-form/dialog-form.component';
import * as moment from 'moment';
import { RegistrationFormFieldType } from '../registration-form-status.enum';
import * as XLSX from 'xlsx';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

export enum EventProcessType {
  'Initial',
  'Preparation',
  'InProgress',
  'Schedule',
  'Closed'
}

enum EventProcessStatus {
  'Open',
  'In Progress',
  'Done',
  'Verified',
  'Closed'
}

@Component({
  selector: 'app-event-plan-view',
  templateUrl: './event-plan-view.component.html',
  styleUrls: ['./event-plan-view.component.css'],
  providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class EventPlanViewComponent {
  selectedTabIndex = 0;
  eventPlan: any = {};
  eventPlanService: StandardService;
  attendeeService: StandardService;
  filteredEventProcesses: any[] = [];
  selectProcessStatus = '';
  eventPlanStatus: string[] = ['Initial', 'Preparation', 'InProgress', 'Schedule', 'Closed'];
  isSelectedAllAttendee = false;
  @ViewChild('attendeeTable', { static: false }) attendeeTable: ElementRef;
  attendeeColumns: IStandardColumn[] = [
    { name: 'code', format: 'link', link: '/attendee/view/' },
    { name: 'qrcode', format: 'template', template: item => `<qrcode qrdata="${item.code}" [size]="256" [level]="'H'"></qrcode>` },
    { name: 'name' },
    { name: 'groupName', displayName: 'Group' },
    { name: 'remarks' }
  ];
  attendeeFilterList = [
    { type: 'code', queryType: 'string' },
    { type: 'name', queryType: 'string' },
    { type: 'remarks', queryType: 'string' }
  ];
  attendeeActions = [
    {
      name: 'Group Attendees',
      format: 'function',
      function: selectedItems => {
        const input = prompt('Enter Group Name');
        selectedItems.forEach(element => {
          element.groupName = input;
          const attendeeReq = this.attendeeService.submit(element).subscribe({
            complete: () => {
              attendeeReq.unsubscribe();
            }
          });
        });
        this.refresh();
      },
      isMultiple: true
    }
  ];
  attendeeQueryModel = {
    searchText: '',
    type: '',
    list: [],
    typeOptions: []
  };
  invoice = null;
  quotation = null;
  supplierInvoices = [];
  paymentVouchers = [];
  payments = [];
  // qrcode scanner variables
  availableDevices: MediaDeviceInfo[];
  currentDevice: MediaDeviceInfo = null;
  hasDevices: boolean;
  hasPermission: boolean;
  demoList = [
    { name: 'a', type: 'Initial' },
    { name: 'b', type: 'Initial' },
    { name: 'c', type: 'Schedule' },
    { name: 'd', type: 'Initial' }
  ];

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private pageLoaderService: PageLoaderService,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title,
    private location: Location
  ) {
    this.eventPlanService = new StandardService(this.http, this.dialog, this.router, this.toastr);
    this.eventPlanService.init('event-plan');
    this.setTitle();
    this.refresh();

    this.selectedTabIndex = this.getTabIndexFromUrl(this.location.path(true));
    this.location.subscribe((value: PopStateEvent) => {
      if (value['url']) {
        this.selectedTabIndex = this.getTabIndexFromUrl(value['url']);
      }
    });
  }

  onTabChange(tabIndex) {
    this.location.replaceState(this.location.path() + '#' + tabIndex);
  }

  onCodeResult(resultString: string): void {
    alert('qrcode: ' + resultString);
  }

  onHasPermission(has: boolean): void {
    this.hasPermission = has;
  }

  setTitle() {
    this.titleService.setTitle('View Event Plan - ' + environment.title);
  }

  getTabIndexFromUrl(url) {
    const regex = /#\d+$/;
    const result = regex.exec(url);
    if (result) {
      const tabIndex = url.substr(result.index + 1);
      return Number(tabIndex);
    }
    return 0;
  }

  refresh() {
    const routeParamsReq = this.route.params.subscribe({
      next: params => {
        if (params['id']) {
          this.pageLoaderService.toggle(true);
          const includes = [
            'customer',
            'services.provider',
            'services.providerService',
            'facilities.provider',
            'facilities.providerFacility',
            'processes.provider',
            'processes.providerService',
            'processes.providerFacility',
            'stockItems.stockItem'
          ];
          const getEventPlanReq = this.http
            .get<StandardHttpResponse>(environment.apiUrl + '/service/event-plan/' + params['id'] + '?includes=' + includes.join())
            .pipe(map(res => res.data))
            .subscribe({
              next: data => {
                this.eventPlan = data;
                // sort: formData.processes
                // this.eventPlan.processes.sort((a, b) => (a.order > b.order ? -1 : a.order === b.order ? 0 : 1));
                this.filterProcesses(this.selectProcessStatus);
                this.filterAttendees(this.eventPlan.attendees, this.attendeeQueryModel);
                if (this.eventPlan.registrationForm && this.eventPlan.registrationForm.settings) {
                  this.attendeeQueryModel.typeOptions = Object.keys(this.eventPlan.registrationForm.settings).filter(
                    settingKey => this.eventPlan.registrationForm.settings[settingKey]
                  );
                }

                if (this.attendeeQueryModel.typeOptions.length > 0) {
                  this.attendeeQueryModel.type = this.attendeeQueryModel.typeOptions[0];
                }
                // get invoice
                this.getDataByEventPlanId('invoice', this.eventPlan._id, 'invoice');
                // get quotation
                this.getDataByEventPlanId('quotation', this.eventPlan._id, 'quotation');
                // get supplier invoices
                this.getDataByEventPlanId('supplier-invoice', this.eventPlan._id, 'supplierInvoices');
                // get payment vouchers
                this.getDataByEventPlanId('payment-voucher', this.eventPlan._id, 'paymentVouchers');
                // get payments
                this.getDataByEventPlanId('payment', this.eventPlan._id, 'payments');
                this.pageLoaderService.toggle(false);
              },
              complete: () => {
                getEventPlanReq.unsubscribe();
              }
            });
        }
      },
      complete: () => {
        routeParamsReq.unsubscribe();
      }
    });
  }

  addItemToEvent(type, name) {
    const eventPlan = JSON.parse(JSON.stringify(this.eventPlan));
    const dName = `Event ${name.replace(/^\w/, c => c.toUpperCase())}`;
    const cName = `Event ${dName.substring(0, dName.length - 1)} Item`;
    const obj = this.reformItem({
      name,
      displayName: dName,
      childName: cName,
      fieldName: type
    });
    const fields = [obj];

    const dialogRef = this.dialog.open(DialogFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { domain: 'event-plan', data: eventPlan, callback: true, fields, title: dName }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: data => {
        const funcBeforeSubmit = data => {
          data[name].forEach(element => {
            element.name = element[type].name;
            element.unit = element[type].unit;
            element.unitPrice = element[type].unitPrice;
          });
        };

        this.updateEventPlan(data, funcBeforeSubmit);
      },
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  addEventProcessToEvent() {
    const eventPlan = JSON.parse(JSON.stringify(this.eventPlan));
    const fields: IStandardFormField[] = [
      {
        name: 'processes',
        type: 'table',
        displayName: 'Event Process Items',
        childName: 'Process Item',
        fields: [
          { name: 'name', type: 'string', required: true },
          { name: 'type', type: 'enum', enum: EventProcessType, default: EventProcessType[EventProcessType.Initial] },
          {
            name: 'processType',
            type: 'enum',
            enumList: [
              { key: 'Service', value: 'Service' },
              { key: 'Facility', value: 'Facility' }
            ]
          },
          { name: 'provider', type: 'ref', isShow: (eventPlan: any) => !!eventPlan.processType },
          {
            name: 'providerService',
            displayName: 'Service',
            type: 'ref',
            filterOption: { type: 'provider', fieldName: '_id' },
            isShow: (eventPlan: any) => eventPlan.processType === 'Service'
          },
          {
            name: 'providerFacility',
            displayName: 'Facility',
            type: 'ref',
            isShow: (eventPlan: any) => eventPlan.processType === 'Facility'
          },
          { name: 'startFromDate', type: 'date', required: true },
          { name: 'startFromTime', type: 'time', required: true },
          { name: 'endToDate', type: 'date', required: true },
          { name: 'endToTime', type: 'time', required: true },
          { name: 'remarks', type: 'textarea' }
        ]
      }
    ];

    const dialogRef = this.dialog.open(DialogFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { domain: 'event-plan', data: eventPlan, callback: true, fields, title: 'Event Processes' }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: data => {
        if (data.dismiss) {
          return;
        }
        data.processes.filter(process => !process.status).forEach(process => (process.status = 'Open'));
        this.updateEventPlan(data);
      },
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  addAttendee() {
    const getFormFieldsFromSettings = (settings: Object, fields: any[]): any[] => {
      const settingFields = Object.keys(settings)
        .map(key => {
          return {
            key,
            value: settings[key]
          };
        })
        .filter(setting => setting.value)
        .map(setting => {
          return {
            name: setting.key,
            type: 'string'
          };
        });
      fields.forEach(field => settingFields.push(field));
      return settingFields;
    };

    const fields: IStandardFormField[] = getFormFieldsFromSettings(
      this.eventPlan.registrationForm.settings,
      this.eventPlan.registrationForm.fields
    );

    const dialogRef = this.dialog.open(DialogFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { callback: true, fields, title: 'Attendee' }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: data => {
        if (!data.dismiss) {
          const formData = {};
          this.eventPlan.registrationForm.fields.forEach(field => {
            formData[field.name] = data[field.name];
          });
          data.formData = formData;
          this.eventPlan.attendees.push(data);
          this.updateEventPlan(this.eventPlan, null, true);
        }
      },
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  editAttendee(attendee) {
    const getFormFieldsFromSettings = (settings: Object, fields: any[]): any[] => {
      const settingFields = Object.keys(settings)
        .map(key => {
          return {
            key,
            value: settings[key]
          };
        })
        .filter(setting => setting.value)
        .map(setting => {
          return {
            name: setting.key,
            type: 'string'
          };
        });
      fields.forEach(field => settingFields.push(field));
      return settingFields;
    };

    const fields: IStandardFormField[] = getFormFieldsFromSettings(
      this.eventPlan.registrationForm.settings,
      this.eventPlan.registrationForm.fields
    );

    const dialogRef = this.dialog.open(DialogFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { callback: true, fields, data: attendee, title: 'Attendee' }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: data => {
        if (!data.dismiss) {
          const formData = {};
          this.eventPlan.registrationForm.fields.forEach(field => {
            formData[field.name] = data[field.name];
          });
          data.formData = formData;
          this.updateEventPlan(this.eventPlan, null, true);
        }
      },
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  removeAttendee(attendee) {
    const confirmedDelete = confirm('Are you sure to delete the attendee "' + attendee.name + '"');
    if (confirmedDelete) {
      const attendees = (this.eventPlan.attendees = this.eventPlan.attendees.filter(item => item !== attendee));
      const attendeeQueryModel = this.attendeeQueryModel;
      const eventPlanReq = this.eventPlanService.submit(this.eventPlan).subscribe({
        complete: () => {
          this.filterAttendees(attendees, attendeeQueryModel);
          this.toastr.info('Attendee has been removed');
          eventPlanReq.unsubscribe();
        }
      });
    }
  }

  filterAttendees(attendees, queryModel) {
    if (queryModel.type && queryModel.searchText) {
      queryModel.list = attendees.filter(attendee => {
        const value = attendee[queryModel.type];
        if (value) {
          return value.toUpperCase().includes(queryModel.searchText.toUpperCase());
        }
        return false;
      });
    } else {
      queryModel.list = attendees;
    }
  }

  getAttendees() {
    const getAttendeesReq = this.http.get(environment.apiUrl + '/service/event-plan/get-attendee-list/' + this.eventPlan._id).subscribe({
      next: (res: any) => {
        this.eventPlan.attendees = res.attendees;
      },
      complete: () => {
        getAttendeesReq.unsubscribe();
      }
    });
  }

  importAttendees() {
    const dialogRef = this.dialog.open(ImportAttendeesComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { eventPlan: this.eventPlan }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: res => {
        if (!res.dismiss) {
          this.toastr.info('Imported Successfully!');
          this.refresh();
        }
      },
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  exportAttendees() {
    const element = this.attendeeTable.nativeElement.cloneNode(true);
    const headerTds: any[] = element.childNodes[0].childNodes[0].childNodes;
    headerTds[0].remove(); // remove thead > td: checkbox
    headerTds[headerTds.length - 1].remove(); // remove thead > td: action
    element.childNodes[1].childNodes.forEach((node: any) => {
      if (node.nodeName === 'TR') {
        node.childNodes[0].remove(); // remove body > td: checkbox
        node.childNodes[node.childNodes.length - 1].remove(); // remove tbody > td: action
      }
    });
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.eventPlan.code + '-attendee_list.xlsx');
  }

  hasAttendeeIsSelected(attendees): boolean {
    if (!attendees || attendees.length <= 0) {
      return false;
    }
    return attendees.some(attendee => attendee.isSelected);
  }

  selectAllAttendee(attendees: any[], isSelectAll: boolean) {
    attendees.forEach(attendee => (attendee.isSelected = isSelectAll));
  }

  checkIsAllAttendeeSelected(attendees: any[]) {
    const isAllSelected = attendees.every(attendee => attendee.isSelected);

    if (this.isSelectedAllAttendee !== isAllSelected) {
      this.isSelectedAllAttendee = isAllSelected;
    }
  }

  groupAttendees() {
    const selectedAttendees = this.eventPlan.attendees.filter(attendee => attendee.isSelected);
    const groupName = prompt('Please Enter the Group Name');

    if (!groupName && groupName !== null) {
      this.toastr.error('Group Name cannot be empty');
    }

    if (!groupName) {
      return;
    }

    selectedAttendees.forEach(attendee => (attendee.group = groupName));

    const updateGroupAttenddesReq = this.eventPlanService.submit(this.eventPlan).subscribe({
      complete: () => {
        this.toastr.info('Grouped Attendees Successfully!');
        updateGroupAttenddesReq.unsubscribe();
      }
    });
  }

  configForm(eventPlan) {
    const eventPlanData = JSON.parse(JSON.stringify(eventPlan));
    const fields: IStandardFormField[] = [
      {
        name: 'registrationForm',
        type: 'object',
        fields: [
          { name: 'title', type: 'string', required: true },
          { name: 'description', type: 'textarea' },
          {
            name: 'settings',
            type: 'object',
            fields: [
              { name: 'name', type: 'boolean' },
              { name: 'gender', type: 'boolean' },
              { name: 'identityNumber', type: 'boolean' },
              { name: 'email', type: 'boolean' },
              { name: 'phoneNumber', type: 'boolean' },
              { name: 'organization', type: 'boolean' },
              { name: 'address', type: 'boolean' }
            ]
          },
          {
            name: 'fields',
            type: 'table',
            displayName: 'Form Fields',
            childName: 'Field',
            default: [],
            fields: [
              { name: 'name', type: 'string' },
              {
                name: 'type',
                type: 'enum',
                enum: RegistrationFormFieldType,
                default: RegistrationFormFieldType[RegistrationFormFieldType.string]
              },
              { name: 'displayName', type: 'string' }
            ]
          },
          { name: 'remarks', type: 'textarea' }
        ]
      }
    ];

    const dialogRef = this.dialog.open(DialogFormComponent, {
      disableClose: true,
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      data: { domain: 'event-plan', data: eventPlanData, callback: true, fields, title: 'Registration Form' }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: data => this.updateEventPlan(data),
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  // source: https://stackoverflow.com/questions/49102724/angular-5-copy-to-clipboard
  copyRegistrationFormLink(formId) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = `http:/localhost:4200/register/${formId}`;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.toastr.info('Copied to clipboard!');
  }

  sendRegistrationFormLink(formId) {
    const formData = {};
    const fields = [{ name: 'email', type: 'string', required: true }];

    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: 'auto',
      minWidth: '50vw',
      maxHeight: '99vh',
      disableClose: true,
      data: { domain: 'registration-form', data: formData, fields, title: 'Send Registration Form Link', callback: true }
    });

    const dialogClosedReq = dialogRef.afterClosed().subscribe({
      next: data => {
        if (!data.dismiss) {
          this.pageLoaderService.toggle(true);
          const url = this.eventPlanService.apiUrl + '/sendRegistrationFormLink';
          const eventPlanReq = this.eventPlanService.submit({ formId, email: data.email }, url).subscribe({
            next: () => {
              this.pageLoaderService.toggle(false);
              this.toastr.info('Sent link to the email!');
            },
            complete: () => {
              eventPlanReq.unsubscribe();
            }
          });
        }
      },
      complete: () => {
        this.setTitle();
        dialogClosedReq.unsubscribe();
      }
    });
  }

  getDataByEventPlanId(itemName: string, eventPlanId: string, sourceName: string): void {
    const source = this;
    const getData$ = this.http.get(environment.apiUrl + '/service/' + itemName + '/getByEventPlanId/' + eventPlanId).subscribe({
      next: ({ data }: any) => {
        source[sourceName] = data;
      },
      complete: () => getData$.unsubscribe()
    });
  }

  changeItemStatus(item, domainName, status) {
    item.status = status;
    const updateItem$ = this.http.put(environment.apiUrl + '/service/' + domainName, item).subscribe({
      next: () => {
        this.toastr.info('Updated Succesfully!');
      },
      complete: () => {
        updateItem$.unsubscribe();
      }
    });
  }

  generateInvoiceFromQuotation(quotation) {
    const invoiceData = Object.assign({}, quotation);
    delete invoiceData._id;
    delete invoiceData.status;
    delete invoiceData.remarks;
    delete invoiceData.code;
    invoiceData.quotation = quotation._id;
    const createInvoice$ = this.http.post(environment.apiUrl + '/service/invoice', invoiceData).subscribe({
      next: res => {
        this.getDataByEventPlanId('invoice', this.eventPlan._id, 'invoice');
        this.toastr.info('Invoice Generated Successfully!');
      },
      complete: () => createInvoice$.unsubscribe()
    });
  }

  checkButtonIsValid(invoice: any, validStatuses: string[]): boolean {
    if (validStatuses && validStatuses.length > 0) {
      return validStatuses.includes(invoice.status);
    }

    return false;
  }

  changeProcessStatus(process, status) {
    process.status = status;
    const eventPlanReq = this.eventPlanService.submit(this.eventPlan).subscribe({
      next: () => {
        this.filterProcesses(this.selectProcessStatus);
        console.log(this.selectProcessStatus);
        this.toastr.info('Updated Status Succesfully!');
      },
      complete: () => {
        eventPlanReq.unsubscribe();
      }
    });
  }

  filterProcesses(status?: string) {
    if (!status) {
      this.filteredEventProcesses = this.eventPlan.processes;
      this.selectProcessStatus = status;
    } else {
      this.selectProcessStatus = status;
      this.filteredEventProcesses = this.eventPlan.processes.filter(val => val.status === status);
    }
    // this.filteredEventProcesses.sort((a, b) => (a.order > b.order ? -1 : a.order === b.order ? 0 : 1));
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousIndex === event.currentIndex) {
      return;
    }
    moveItemInArray(this.eventPlan.processes, event.previousIndex, event.currentIndex);
    const eventPlanReq = this.eventPlanService.submit(this.eventPlan).subscribe({
      next: () => {
        this.toastr.info('Moved Process Position!');
      },
      complete: () => {
        eventPlanReq.unsubscribe();
      }
    });
  }

  onMoveUpPosition(item, itemIndex) {
    const targetItem = this.eventPlan.processes.find(process => process === item);
    const targetItemIndex = this.eventPlan.processes.findIndex(process => process === item);
    const swapItem = this.eventPlan.processes[targetItemIndex - 1];

    targetItem.order += targetItem.order <= swapItem.order ? 1 : 0;
    swapItem.order -= targetItem.order === swapItem.order ? 1 : 0;

    const eventPlanReq = this.eventPlanService.submit(this.eventPlan).subscribe({
      next: () => {
        this.toastr.info('Moved Process ' + item.name);
      },
      complete: () => {
        eventPlanReq.unsubscribe();
      }
    });
  }

  onMoveDownPosition(item, itemIndex) {
    const targetItem = this.eventPlan.processes[itemIndex];
    const swapItem = this.eventPlan.processes[itemIndex + 1];

    targetItem.order = targetItem.order >= swapItem.order ? swapItem.order : targetItem.order;
    swapItem.order = targetItem.order <= swapItem.order ? swapItem.order + 1 : targetItem.order - 1;

    const eventPlanReq = this.eventPlanService.submit(this.eventPlan).subscribe({
      next: () => {
        this.toastr.info('Moved Process ' + item.name);
      },
      complete: () => {
        eventPlanReq.unsubscribe();
      }
    });
  }

  getDuration(process) {
    let from;
    let fromTime;
    let to;
    let toTime;
    const durationMonths = moment(process.endToDate).diff(moment(process.startFromDate), 'months');

    if (durationMonths > 0) {
      from = moment(process.startFromDate).format('DD MMM');
      fromTime = moment(process.startFromTime).format('HH:mm A');
      to = moment(process.endToDate).format('DD MMM YY');
      toTime = moment(process.endToTime).format('HH:mm A');
    } else {
      from = moment(process.startFromDate).format('DD');
      fromTime = moment(process.startFromTime).format('HH:mm A');
      to = moment(process.endToDate).format('DD MMM YY');
      toTime = moment(process.endToTime).format('HH:mm A');
    }

    if (process.processType === EventProcessType[EventProcessType.Schedule]) {
      return `${from}-${to} [${fromTime} - ${toTime}]`;
    }

    return `${from}-${to}`;
  }

  getLinesTotalAmount(lines: any[], extraCharged: boolean) {
    if (!lines) {
      return 0;
    }

    let total = lines.reduce((acc, item) => item.unitPrice * item.quantity + acc, 0);

    if (extraCharged) {
      total = total * (1 + this.eventPlan.markupRate / 100);
    }

    return this.formatCurrency(total);
  }

  formatCurrency(amount) {
    const dotIndex = amount.toString().indexOf('.');

    if (dotIndex === -1) {
      return amount;
    }

    const number = amount.toString().substr(0, dotIndex);
    let decimal = amount.toString().substr(number.length + 1, 2);
    let firstDigit = decimal.substr(0, 1);
    const lastDigit = decimal.length === 2 ? decimal.substr(decimal.length - 1, 1) : '0';
    let newLastDigit;

    switch (lastDigit) {
      case '1':
      case '2':
        newLastDigit = '0';
        // round down to 0
        break;
      case '3':
      case '4':
        newLastDigit = '5';
        // round up to 5
        break;
      case '6':
      case '7':
        newLastDigit = '5';
        // round down to 5
        break;
      case '8':
      case '9':
        newLastDigit = '0';
        firstDigit = (Number(firstDigit) + 1).toString();
        // round up to 0
        break;
      default:
        newLastDigit = lastDigit;
        break;
    }

    decimal = firstDigit + newLastDigit;

    return Number(Number(number + '.' + decimal).toFixed(2));
  }

  getOutsandingBalance(paymentForType: string, item: any) {
    const totalAmount = this.getLinesTotalAmount(item.lines, paymentForType === 'Customer');

    if (!this.payments || this.payments.length === 0 || !item) {
      return totalAmount;
    }

    const paidAmount = this.payments
      .filter(payment => {
        return (
          payment.type === paymentForType &&
          (payment.status === 'Verified' || payment.status === 'Closed') &&
          ((paymentForType === 'Customer' && payment.invoice && payment.invoice._id === item._id) ||
            (paymentForType === 'Provider' && payment.supplierInvoice && payment.supplierInvoice._id === item._id))
        );
      })
      .reduce((acc, payment) => acc + payment.amount, 0);

    return this.formatCurrency(totalAmount - paidAmount);
  }

  private reformItem({ name, displayName, childName, fieldName }) {
    return {
      name,
      displayName,
      type: 'table',
      childName,
      fields: [
        { name: fieldName, type: 'ref', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'remarks', type: 'textarea' }
      ]
    };
  }

  private updateEventPlan(data: any, funcBeforeSubmit?: any, shouldRefresh?: boolean) {
    if (!data.dismiss) {
      if (funcBeforeSubmit) {
        funcBeforeSubmit(data);
      }

      const eventPlanReq = this.eventPlanService.submit(data).subscribe({
        next: () => {
          this.eventPlan = data;
          this.filterProcesses(this.selectProcessStatus);
          if (shouldRefresh) {
            this.refresh();
          }
          this.toastr.info('Updated');
        },
        complete: () => {
          eventPlanReq.unsubscribe();
        }
      });
    }
  }
}
