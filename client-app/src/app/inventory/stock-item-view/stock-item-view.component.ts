import { StandardHttpResponse } from 'src/app/standard/standard.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { IStandardDisplayField } from './../../standard/standard.interface';
import { ActivatedRoute } from '@angular/router';
import { StandardService } from './../../standard/standard.service';
import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-stock-item-view',
  templateUrl: './stock-item-view.component.html',
  styleUrls: ['./stock-item-view.component.css']
})
export class StockItemViewComponent implements OnInit {
  stockItem: any;
  stockTransactions = [];
  displayFields: IStandardDisplayField[] = [
    { name: 'name' },
    { name: 'category.name', displayName: 'Category' },
    { name: 'unit' },
    { name: 'unitPrice' },
    { name: 'quantity' },
    { name: 'remarks' },
  ];

  constructor(private route: ActivatedRoute, private stockItemService: StandardService, private titleService: Title, private http: HttpClient) {
    this.stockItemService.init('stock-item');
    this.stockItemService.apiUrl = environment.apiUrl + '/service/stock-item-with-qty';
    this.titleService.setTitle('View Stock Item - ' + environment.title);
  }

  ngOnInit() {
    this.route.params.subscribe((params) => {
      if (params['id']) {
        this.stockItemService.fetch(params['id'], null, ['category']).subscribe({
          next: ({ data }) => {
            this.stockItem = data;
          }
        });
        const queryModel = { type: 'stockItem', searchText: params.id, queryType: 'match' };
        const stockTransactionReq$ = this.http.get<StandardHttpResponse>(environment.apiUrl + '/service/stock-transaction?queryModel=' + JSON.stringify(queryModel)).subscribe({
          next: ({ data }) => {
            this.stockTransactions = data;
          },
          complete: () => {
            stockTransactionReq$.unsubscribe();
          }
        });
      }
    });
  }
}
