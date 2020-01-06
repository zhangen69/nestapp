import { environment } from 'src/environments/environment';
import { StandardHttpResponse, IStandardDisplayField } from 'src/app/standard/standard.interface';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {
  customer: any;
  invoices = [];
  customerDisplayFields: IStandardDisplayField[] = [
    { name: 'name' },
    { name: 'email' },
    { name: 'registrationNumber' },
    { name: 'address' }
  ];
  invoiceDisplayFields: IStandardDisplayField[] = [
    { name: 'code', type: 'title' },
    { name: 'eventPlan.code', type: 'link', link: item => '/event-plan/view/' + item.eventPlan._id, displayName: 'Event Plan Code' },
    { name: 'eventPlan.name', displayName: 'Event Plan Name' },
    { name: 'totalAmount', type: 'currency', getValue: item => item.lines.reduce((acc, line) => acc + line.quantity * line.unitPrice, 0) },
    { name: 'status' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      if (params.id) {
        const req$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/customer/' + params.id).subscribe({
          next: ({ data }) => {
            this.customer = data;
          },
          complete: () => {
            req$.unsubscribe();
          }
        });
        const invoiceQueryModel = {
          type: 'customer',
          searchText: params.id,
          queryType: 'match',
          includes: ['eventPlan']
        };
        const invoiceReq$ = this.http
          .get<StandardHttpResponse>(environment.apiUrl + '/service/invoice?queryModel=' + JSON.stringify(invoiceQueryModel))
          .subscribe({
            next: ({ data }) => {
              this.invoices = data;
            },
            complete: () => {
              invoiceReq$.unsubscribe();
            }
          });
      }
    });
  }
}
