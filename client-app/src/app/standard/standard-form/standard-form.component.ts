import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StandardService } from 'src/app/standard/standard.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { PageLoaderService } from 'src/app/templates/page-loader/page-loader.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-standard-form',
  templateUrl: './standard-form.component.html',
  styleUrls: ['./standard-form.component.css']
})
export class StandardFormComponent implements OnInit {
  @Input() title: string;
  @Input() domainName: string;
  @Input() fields: any[];
  @Input() includes: string[];
  @Input() dataSource: any;
  @Input() callback: boolean;
  @Output() cancel = new EventEmitter<any>();
  @Output() submitFunc = new EventEmitter<any>();
  @Output() afterSubmit = new EventEmitter<any>();

  mode = 'create';
  formData: any = {};
  imagePreview = {};
  pickedImage: any = null;
  formId: string;
  private standardService: StandardService;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public toastr: ToastrService,
    private location: Location,
    private pageLoaderService: PageLoaderService,
    private http: HttpClient,
    private dialog: MatDialog,
    private titleService: Title
  ) {
    this.standardService = new StandardService(this.http, this.dialog, this.router, this.toastr);
  }

  ngOnInit() {
    if (this.title) {
      this.titleService.setTitle('New ' + this.title + ' - ' + environment.title);
    }

    this.formId = 'form_' + moment().format('x');
    this.standardService.init(this.domainName);
    this.route.params.subscribe((params: Params) => {
      if (params['id']) {
        if (this.title) {
          this.titleService.setTitle('Edit ' + this.title + ' - ' + environment.title);
        }

        this.pageLoaderService.toggle(true);
        this.mode = 'update';
        this.standardService.fetch(params['id'], null, this.includes).subscribe(
          (res: any) => {
            this.formData = res.data;
            this.initialDefaultValues();
            this.pageLoaderService.toggle(false);
          },
          (res: any) => {
            this.pageLoaderService.toggle(false);
            this.toastr.error(res.error.message);
          }
        );
      }
    });
    this.fields.forEach(field => {
      if (field.default) {
        this.formData[field.name] = field.default;
      }
    });
    if (this.dataSource) {
      this.mode = 'update';
      this.formData = this.dataSource;
    }
  }

  private initialDefaultValues() {
    this.fields.forEach(field => {
      let defaultValue;

      switch (field.type) {
        case 'object':
          defaultValue = {};
          break;
        case 'array':
        case 'table':
          defaultValue = [{}];
          break;
        case 'date':
        case 'time':
          defaultValue = new Date();
          break;
        case 'boolean':
          defaultValue = false;
          break;
      }

      if (!this.checkHasValue(this.formData, field.name)) {
        this.formData[field.name] = defaultValue;
      }
    });
  }

  private checkHasValue(formData, fieldName) {
    return formData[fieldName];
  }

  onUploadFile() {
    this.standardService.uploadImage(this.pickedImage).then((res: any) => {
      this.formData.photoUrl = res.url;
      this.pickedImage = null;
      this.onSubmit();
    });
  }

  onCancel(url) {
    if (this.cancel.observers.length > 0) {
      this.cancel.emit({ dismiss: true });
    } else if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate([`/${this.domainName}/list`]);
    }
  }

  onSubmit() {
    if (this.pickedImage !== null) {
      this.onUploadFile();
    } else if (this.callback && this.submitFunc.observers.length > 0) {
      this.submitFunc.emit(this.formData);
    } else {
      this.fields
        .filter(field => {
          return field.type === 'ref';
        })
        .forEach(field => {
          if (typeof this.formData[field.type] !== 'object') {
            this.formData[field.type] = null;
          }
        });

      this.pageLoaderService.toggle(true);
      this.standardService.submit(this.formData).subscribe(
        (res: any) => {
          this.toastr.success(res.message);
          this.pageLoaderService.toggle(false);
          if (this.afterSubmit.observers.length > 0) {
            this.formData._id = res.data._id;
            this.afterSubmit.emit(this.formData);
          } else {
            this.onCancel(`/${this.domainName}/list`);
          }
        },
        (res: any) => {
          this.pageLoaderService.toggle(false);
          this.toastr.error(res.error.message);
        }
      );
    }
  }
}
