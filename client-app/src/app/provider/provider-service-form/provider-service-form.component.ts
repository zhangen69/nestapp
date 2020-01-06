import { HttpClient } from '@angular/common/http';
import { environment } from './../../../environments/environment';
import { ActivatedRoute, Router, } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-provider-service-form',
  templateUrl: './provider-service-form.component.html',
  styleUrls: ['./provider-service-form.component.css']
})
export class ProviderServiceFormComponent implements OnInit {
  formData: any = {};
  callbackUrl: string;
  callbackFragment: string;
  includes = ['provider', 'category'];
  fields = [
    { name: 'provider', type: 'ref', required: true },
    { name: 'category', type: 'ref', required: true },
    { name: 'name', type: 'string', required: true },
    { name: 'unit', type: 'string', required: true },
    { name: 'unitPrice', type: 'number', required: true },
    { name: 'description', type: 'textarea' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient, private location: Location, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (params.provider) {
        this.getData(params.provider, 'provider', 'provider');
      }
      if (params.callback) {
        this.callbackUrl = params.callback;
      }
      if (params.fragment) {
        this.callbackFragment = params.fragment;
      }
    });
  }

  ngOnInit() {}

  getData(id, domainName, propName) {
    const req$ = this.http.get<{ data }>(environment.apiUrl + '/service/' + domainName + '/' + id).subscribe({
      next: ({ data }) => {
        this.formData[propName] = data;
      },
      complete: () => {
        req$.unsubscribe();
      }
    });
  }

  redirectTo() {
    if (this.callbackUrl && this.callbackFragment) {
      this.router.navigate([this.callbackUrl], { fragment: this.callbackFragment });
    } else {
      if (window.history.length > 1) {
        this.location.back();
      } else {
        this.router.navigate(['/provider-service/list']);
      }
    }
  }
}
