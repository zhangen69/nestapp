import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-provider-facility-form',
  templateUrl: './provider-facility-form.component.html',
  styleUrls: ['./provider-facility-form.component.css']
})
export class ProviderFacilityFormComponent implements OnInit {
  formData: any = {};
  includes = ['provider', 'category'];
  fields = [
    { name: 'provider', type: 'ref', required: true },
    { name: 'category', type: 'ref', required: true },
    { name: 'name', type: 'string', required: true },
    { name: 'unit', type: 'string', required: true },
    { name: 'unitPrice', type: 'number', required: true },
    { name: 'description', type: 'textarea' }
  ];

  constructor(private route: ActivatedRoute, private http: HttpClient) {
    this.route.queryParams.subscribe(params => {
      if (params.provider) {
        this.getData(params.provider, 'provider', 'provider');
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
}
