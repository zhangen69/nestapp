import { Component, OnInit, Input, ViewChild, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { TitleDisplayPipe } from 'src/app/pipes/title-display.pipe';

@Component({
  selector: 'app-standard-filter',
  templateUrl: './standard-filter.component.html',
  styleUrls: ['./standard-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StandardFilterComponent implements OnInit {
  @Input() filterList: any;
  @Input() queryModel: any;
  @Output() refresh = new EventEmitter<any>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  selectedFilter: any;
  selectedFilterListerner = new Subject<any>();

  constructor(private titleDisplayPipe: TitleDisplayPipe) { }

  ngOnInit() {
    this.selectedFilterListerner.asObservable().subscribe(filter => {
      this.queryModel.type = filter.type;
      this.queryModel.queryType = filter.queryType;
    });

    if (this.filterList && this.filterList.length > 0) {
      this.filterList.forEach((filter) => {
        if (!filter.displayName) {
          filter.displayName = this.titleDisplayPipe.transform(filter.type);
        }
      });
      this.selectedFilter = this.filterList[0];
    this.selectedFilterListerner.next(this.selectedFilter);
    }
  }

  applyFilter() {
    this.refresh.emit();
  }

  onChangeFilter(filter) {
    this.selectedFilterListerner.next(filter);
  }

}
