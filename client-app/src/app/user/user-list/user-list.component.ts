import { PageLoaderService } from './../../templates/page-loader/page-loader.service';
import { UserService } from './../../services/user.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/models/user.model';
import { IQueryModel } from 'src/app/interfaces/query-model';
import { merge } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  isAuth = false;
  dataSource: MatTableDataSource<User>;
  displayedColumns: string[] = ['username', 'displayName', 'email', 'phoneNumber', 'audit.updatedDate', 'action'];
  totalItems = 0;
  queryModel: IQueryModel = {
    pageSize: 5,
    currentPage: 0,
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(private userService: UserService, private authService: AuthService, private pageLoaderService: PageLoaderService) {
    this.userService.init('user', this.queryModel, this.paginator);
    this.isAuth = this.authService.getIsAuth();
    this.authService.getAuthStatusListener().subscribe(isAuth => this.isAuth = isAuth);
    this.userService.getRefreshListerner().subscribe(() => this.fetchAll());
  }

  ngOnInit() {
    this.fetchAll();
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page).subscribe(() => {
      this.queryModel.currentPage = this.paginator.pageIndex;
      this.fetchAll();
    });
  }

  fetchAll() {
    this.pageLoaderService.toggle(true);
    return this.userService.fetchAll(this.queryModel).subscribe((res: any) => {
      this.dataSource = new MatTableDataSource<User>(res.data);
      this.totalItems = res.totalItems;
      this.pageLoaderService.toggle(false);
    });
  }

  onLockOrUnlockUser(item) {
    if (item.isLocked || item.isAccessFailedLocked) {
      this.userService.unlock(item);
    } else {
      this.userService.lock(item);
    }
  }

  onResetPassword(item) {
    this.userService.resetPassword(item);
  }

  sortData(sort: Sort) {
    this.userService.sort(sort);
  }
}
