import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { PageLoaderService } from 'src/app/templates/page-loader/page-loader.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-register-event',
    templateUrl: './register-event.component.html',
    styleUrls: ['./register-event.component.css']
})
export class RegisterEventComponent implements OnInit {
    mode = 'new';
    registrationForm: any;
    event: any;
    formData: any = {};
    attendeeData: any = {};
    attendee: any;
    qrcodeLink: string;

    constructor(
        private route: ActivatedRoute,
        public http: HttpClient,
        public toastr: ToastrService,
        private pageLoaderService: PageLoaderService
    ) {
    }

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.http.get(environment.apiUrl + '/service/event-plan/getRegistrationForm/' + params['formId']).subscribe((res: any) => {
                this.registrationForm = res.form;
                this.event = res.event;
            });
        });
    }

    onSubmit() {
        const attendeeData = {
            event: this.event._id,
            formData: this.formData
        };

        Object.keys(this.attendeeData).forEach(key => {
            attendeeData[key] = this.attendeeData[key];
        });

        this.pageLoaderService.toggle(true);
        this.http.post(environment.apiUrl + '/service/event-plan/attendee-register', attendeeData).subscribe((res: any) => {
            this.pageLoaderService.toggle(false);
            this.toastr.success(res.message);
            this.mode = 'submitted';
            this.attendee = res.data;
        });
    }

    dlDataUrlBin() {
        const y = document.querySelector('img');
        this.qrcodeLink = y.src;
    }
}
