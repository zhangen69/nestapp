import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StandardHttpResponse, IStandardDisplayField } from 'src/app/standard/standard.interface';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-provider-view',
  templateUrl: './provider-view.component.html',
  styleUrls: ['./provider-view.component.css']
})
export class ProviderViewComponent implements OnInit {
  selectedTabIndex = 0;
  provider: any = {};
  providerServices = [];
  providerFacilities = [];
  supplierInvoices = [];
  paymentVouchers = [];
  providerDisplayFields: IStandardDisplayField[] = [
    { name: 'name' },
    { name: 'email' },
    { name: 'registrationNumber' },
    { name: 'address' },
    { name: 'remarks' },
  ];
  personInChargedDisplayFields: IStandardDisplayField[] = [{ name: 'name' }, { name: 'email' }, { name: 'jobTitle' }];
  supplierInvoiceDisplayFields: IStandardDisplayField[] = [
    { name: 'code', type: 'title' },
    { name: 'eventPlan.code', type: 'link', link: (item) => item.eventPlan ? '/event-plan/view/' + item.eventPlan._id : '', displayName: 'Event Plan Code' },
    { name: 'eventPlan.name', displayName: 'Event Plan Name' },
    { name: 'totalAmount', type: 'currency', getValue: (item) => item.lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0) },
    { name: 'status' },
  ];
  paymentVoucherDisplayFields: IStandardDisplayField[] = [
    { name: 'code', type: 'title' },
    { name: 'eventPlan.code', type: 'link', link: (item) => item.eventPlan ? '/event-plan/view/' + item.eventPlan._id : '', displayName: 'Event Plan Code' },
    { name: 'eventPlan.name', displayName: 'Event Plan Name' },
    { name: 'totalAmount', type: 'currency', getValue: (item) => item.lines.reduce((acc, line) => acc + (line.quantity * line.unitPrice), 0) },
    { name: 'status' },
    { name: 'paymentType' },
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private titleService: Title, private location: Location) {
    this.selectedTabIndex = this.getTabIndexFromUrl(this.location.path(true));
    this.location.subscribe((value: PopStateEvent) => {
      if (value['url']) {
        this.selectedTabIndex = this.getTabIndexFromUrl(value['url']);
      }
    });
    this.titleService.setTitle('View Stock Item - ' + environment.title);
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        const req$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/provider/' + params.id).subscribe({
          next: ({ data }) => {
            this.provider = data;
          },
          complete: () => {
            req$.unsubscribe();
          }
        });
        const queryModel = {
          type: 'provider',
          searchText: params.id,
          queryType: 'match',
          includes: [],
        };
        const providerServicesReq$ = this.http
          .get<StandardHttpResponse>(environment.apiUrl + '/service/provider-service?queryModel=' + JSON.stringify(queryModel))
          .subscribe({
            next: ({ data }) => {
              this.providerServices = data;
            },
            complete: () => {
              providerServicesReq$.unsubscribe();
            }
          });
        const providerFacilitiesReq$ = this.http
          .get<StandardHttpResponse>(environment.apiUrl + '/service/provider-facility?queryModel=' + JSON.stringify(queryModel))
          .subscribe({
            next: ({ data }) => {
              this.providerFacilities = data;
            },
            complete: () => {
              providerFacilitiesReq$.unsubscribe();
            }
          });
          queryModel.includes = ['eventPlan'];
        const supplierInvoicesReq$ = this.http
          .get<StandardHttpResponse>(environment.apiUrl + '/service/supplier-invoice?queryModel=' + JSON.stringify(queryModel))
          .subscribe({
            next: ({ data }) => {
              this.supplierInvoices = data;
            },
            complete: () => {
              supplierInvoicesReq$.unsubscribe();
            }
          });
        const paymentVouchersReq$ = this.http
          .get<StandardHttpResponse>(environment.apiUrl + '/service/payment-voucher?queryModel=' + JSON.stringify(queryModel))
          .subscribe({
            next: ({ data }) => {
              this.paymentVouchers = data;
            },
            complete: () => {
              paymentVouchersReq$.unsubscribe();
            }
          });
      }
    });
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
}
