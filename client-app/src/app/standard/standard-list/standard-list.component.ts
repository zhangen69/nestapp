import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, AfterViewInit, ViewChild, OnDestroy, DoCheck } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { merge, Subscription, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { AuthService } from 'src/app/auth/auth.service';
import { StandardService } from 'src/app/standard/standard.service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { TitleDisplayPipe } from 'src/app/pipes/title-display.pipe';
import { Router } from '@angular/router';
import { PageLoaderService } from 'src/app/templates/page-loader/page-loader.service';
import { ToastrService } from 'ngx-toastr';
import { IStandardColumn } from '../standard.interface';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-standard-list',
  templateUrl: './standard-list.component.html',
  styleUrls: ['./standard-list.component.css']
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardListComponent implements OnInit, OnDestroy, DoCheck, AfterViewInit {
  @Input() columns: IStandardColumn[];
  @Input() filterList: any[];
  @Input() domainName: string;
  @Input() title: string;
  @Input() actions: any[];
  @Input() queryModel: any;
  @Input() domainService: StandardService;
  @Input() customList: any[];
  @Input() apiUrl: string;
  @Input()
  set includes(includes: string[]) {
    if (!this.queryModel) {
      this.queryModel = {};
    }

    this.queryModel.includes = includes || [];
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  isAuth = false;
  selectedItems = [];
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  totalItems = 0;
  requests$: Observable<any>[] = [];
  subscribedRequests$: Subscription[] = [];
  private service = new StandardService(this.http, this.dialog, this.router, this.toastr);

  constructor(
    private authService: AuthService,
    private datePipe: DatePipe,
    private router: Router,
    private pageLoaderService: PageLoaderService,
    private titleDisplayPipe: TitleDisplayPipe,
    private currencyPipe: CurrencyPipe,
    private toastr: ToastrService,
    private http: HttpClient,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => (this.isAuth = isAuth));
  }

  ngOnInit() {
    this.initial(this.domainName);

    if (this.title) {
      this.titleService.setTitle(this.title + ' List - ' + environment.title);
    }

    this.displayedColumns = this.columns.map(x => x.name);
    this.displayedColumns.unshift('checkbox');
    this.displayedColumns.push('action');

    this.columns.forEach(column => {
      if (!column.displayName) {
        column.displayName = this.titleDisplayPipe.transform(column.name);
      }
      if (!column.format) {
        column.format = 'display';
      }
    });

    this.service.getRefreshListerner().subscribe(() => {
      this.fetchAll();
    });
    this.service.setRefreshListerner();
  }

  ngOnDestroy(): void {
    this.unsubscribeRequests();
  }

  ngDoCheck() {
    if (this.customList !== undefined && this.dataSource !== undefined) {
      const changes = this.customList !== this.dataSource.data;
      if (changes) {
          this.applyFilter();
      }
    }
}
  unsubscribeRequests() {
    if (this.subscribedRequests$.length > 0) {
      this.subscribedRequests$.forEach(subscription => {
        subscription.unsubscribe();
        subscription.remove(subscription);
        console.log(`${this.domainName} is unsubscribed`);
      });
    }
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.queryModel.currentPage = this.paginator.pageIndex;
      this.fetchAll();
    });
  }

  initial(domainName) {
    if (!this.queryModel) {
      this.queryModel = {};
    }

    if (!('pageSize' in this.queryModel)) {
      this.queryModel.pageSize = 10;
    }
    if (!('currentPage' in this.queryModel)) {
      this.queryModel.currentPage = 0;
    }

    this.service.init(domainName, this.queryModel);

    if (this.apiUrl) {
      this.service.apiUrl = this.apiUrl;
    }

  }

  fetchAll() {
    if (this.customList !== undefined) {
      this.dataSource = new MatTableDataSource<any>(this.customList);
    } else {
      this.pageLoaderService.toggle(true);
      const req$ = this.service
        .fetchAll(this.queryModel)
        .pipe()
        .subscribe({
          next: (res: any) => {
            this.dataSource = new MatTableDataSource<any>(res.data);
            this.totalItems = res.totalItems;
            this.pageLoaderService.toggle(false);
          },
          error: (res: any) => {
            this.pageLoaderService.toggle(false);
            this.toastr.error(res.error.message);
          },
          complete: () => req$.unsubscribe()
        });

      return req$;
    }
  }

  delete(item) {
    this.service.delete(item);
  }

  sortData(sort: Sort) {
    this.service.sort(sort);
  }

  applyFilter() {
    if (this.customList !== undefined) {
      this.fetchAll();
      this.paginator.firstPage();
    } else {
      this.fetchAll().add(() => this.paginator.firstPage());
    }
  }

  getValue(item, column) {
    let value = item[column.name];

    if (column.name.includes('.')) {
      let thisVal = item;
      column.name.split('.').forEach(ele => {
        if (!thisVal) {
          return;
        }
        thisVal = thisVal[ele];
      });
      value = thisVal;
    }

    switch (column.type) {
      case 'date':
      case 'time':
        value = this.datePipe.transform(value, column.dateFormat || 'hh:mm a, dd-MM-yyyy');
        break;
      case 'currency':
        value = this.currencyPipe.transform(value);
        break;
      case 'array':
        let arrayIndex = column.index || 0;

        if (value && value.length && column.key) {
          arrayIndex = value.findIndex((currentVal, index, arr) => {
            return currentVal[column.key] === column.keyVal;
          });
        }

        value = value && value.length && arrayIndex > -1 ? value[arrayIndex][column.fieldName] : null;
        break;
      default:
        break;
    }

    return value;
  }

  getLink(item, col) {
    if (typeof col.link === 'string') {
      return col.link + '/' + item._id;
    } else if (typeof col.link === 'function') {
      return col.link(item);
    }
  }

  toggleItemSelection() {
    this.selectedItems = this.dataSource.data.filter(x => x.selected);
  }

  executeAction(action) {
    if (action.format === 'link' && action.link) {
      this.router.navigate([action.link]);
    }

    if (action.format === 'function' && action.function) {
      action.function(action.isMultiple ? this.selectedItems : this.selectedItems[0]);
    }
  }

  showAction(action) {
    if (this.selectedItems.length === 0) {
      return false;
    }

    if (this.selectedItems.length > 0 && !action.isMultiple) {
      if (action.show) {
        return action.show(this.selectedItems[0]);
      } else {
        return true;
      }
    }

    return true;
  }

  renderTemplate(column, item) {
    const html = column.template(item);
    return html;
  }
}
