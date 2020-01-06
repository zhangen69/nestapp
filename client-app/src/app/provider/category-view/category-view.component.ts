import { Component, OnInit } from '@angular/core';
import { IStandardDisplayField, StandardHttpResponse } from 'src/app/standard/standard.interface';
import { ActivatedRoute } from '@angular/router';
import { StandardService } from 'src/app/standard/standard.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-category-view',
  templateUrl: './category-view.component.html',
  styleUrls: ['./category-view.component.css']
})
export class CategoryViewComponent implements OnInit {
  category: any;
  providerServices = [];
  providerFacilities = [];
  stockItems = [];
  displayFields: IStandardDisplayField[] = [
    { name: 'name' },
    { name: 'remarks' },
  ];
  itemDisplayFields: IStandardDisplayField[] = [
    { name: 'name' },
    { name: 'provider.name', displayName: 'Provider' },
    { name: 'unit' },
    { name: 'unitPrice' },
    { name: 'remarks' },
  ];

  constructor(private route: ActivatedRoute, private standardService: StandardService, private titleService: Title, private http: HttpClient) {
    this.standardService.init('category');
    this.titleService.setTitle('View Category - ' + environment.title);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params.id) {
        this.standardService.fetch(params.id).subscribe({
          next: ({ data }) => {
            this.category = data;
          }
        });
        const queryModel = { type: 'category', searchText: params.id, queryType: 'match', includes: ['provider'] };
        const providerServicesReq$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/provider-service?queryModel=' + JSON.stringify(queryModel)).subscribe({
          next: ({ data }) => {
            this.providerServices = data;
          },
          complete: () => {
            providerServicesReq$.unsubscribe();
          }
        });
        const providerFacilitiesReq$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/provider-facility?queryModel=' + JSON.stringify(queryModel)).subscribe({
          next: ({ data }) => {
            this.providerFacilities = data;
          },
          complete: () => {
            providerFacilitiesReq$.unsubscribe();
          }
        });
        const stockItemsReq$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/stock-item?queryModel=' + JSON.stringify(queryModel)).subscribe({
          next: ({ data }) => {
            this.stockItems = data;
          },
          complete: () => {
            stockItemsReq$.unsubscribe();
          }
        });
      }
    });
  }

}
