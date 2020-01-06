import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ConfirmationDialogComponent } from '../templates/confirmation-dialog/confirmation-dialog.component';
import { IQueryModel } from '../interfaces/query-model';
import { UploadType } from '../enums/upload-type.enum';
import { ToastrService } from 'ngx-toastr';
import { Subject, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { StandardHttpResponse } from './standard.interface';

@Injectable({
    providedIn: 'root'
})
export class StandardService {
    domain: string;
    apiUrl: string;
    queryModel: IQueryModel;
    paginator: MatPaginator;
    refreshListerner = new Subject();

    constructor(public http: HttpClient, public dialog: MatDialog, public router: Router, public toastr: ToastrService) {}

    init(domain, queryModel?, paginator?) {
        this.domain = domain;
        this.apiUrl = `${environment.apiUrl}/service/${this.domain}`;
        this.queryModel = queryModel;
        this.paginator = paginator;
        return this;
    }

    getRefreshListerner() {
        return this.refreshListerner.asObservable();
    }

    setRefreshListerner() {
        this.refreshListerner.next();
    }

    create(formData) {
        const req$ = this.http.post(this.apiUrl, formData).subscribe({
            next: (res: any) => {
                this.toastr.success(res.message);
                this.router.navigate([`/${this.domain}/list`]);
            },
            error: (res: any) => this.toastr.error(res.error.message),
            complete: () => req$.unsubscribe(),
        });
    }

    update(formData) {
        const req$ = this.http.put(this.apiUrl, formData).subscribe({
            next: (res: any) => {
                this.toastr.success(res.message);
                this.router.navigate([`/${this.domain}/list`]);
            },
            error: (res: any) => this.toastr.error(res.error.message),
            complete: () => req$.unsubscribe(),
        });
    }

    submit(formData, url = null): Observable<any> {
        let mode = 'post';

        if (formData._id) {
            mode = 'put';
        }

        const req$ = this.http[mode](url || this.apiUrl, formData).pipe(throttleTime(500));
        return req$;
    }

    fetch(id, formData = null, includes = []) {
        let url = `${this.apiUrl}/${id}`;

        if (includes.length > 0) {
            url += `?includes=${includes.toString()}`;
        }

        const fetchData = this.http.get<StandardHttpResponse>(url);

        if (formData !== null) {
            const req$ = fetchData.subscribe({
                next: (res: any) => (formData = res.data),
                error: (res: any) => this.toastr.error(res.error.message),
                complete: () => req$.unsubscribe(),
            });
            return;
        }

        return fetchData;
    }

    fetchAll(queryModel: IQueryModel) {
        if (!queryModel) {
            queryModel = {
                pageSize: 10,
                currentPage: 0
            };
        }

        const req$ = this.http.get(this.apiUrl + '?queryModel=' + JSON.stringify(queryModel)).pipe(throttleTime(500));
        return req$;
    }

    delete(item) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: { item }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                const req$ = this.http.delete(this.apiUrl + '/' + result._id).subscribe({
                    next: (res: any) => {
                        this.toastr.success(res.message);
                        this.setRefreshListerner();
                    },
                    error: (res: any) => this.toastr.error(res.error.message),
                    complete: () => req$.unsubscribe(),
                });
            }
        });
    }

    uploadImage(file: File, type: UploadType = UploadType.Multer) {
        const formData = new FormData();
        formData.append('image', file);

        let uploadUrl = '/multer';

        if (type === UploadType.Cloudinary) {
            uploadUrl = '/cloudinary';
        }

        return this.http
            .post(environment.apiUrl + uploadUrl + '/upload', formData)
            .toPromise()
            .then((res: any) => {
                this.toastr.success(res.message);
                return res;
            })
            .catch((res: any) => {
                this.toastr.success(res.error.message);
                return res.error;
            });
    }

    sort(sort: Sort) {
        this.queryModel.sort = sort.active;
        this.queryModel.sortDirection = sort.direction.toUpperCase();
    }
}
