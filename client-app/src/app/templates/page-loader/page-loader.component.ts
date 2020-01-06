import { Component, OnInit } from '@angular/core';
import { PageLoaderService } from './page-loader.service';

@Component({
    selector: 'app-page-loader',
    templateUrl: './page-loader.component.html',
    styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements OnInit {
    isShow: boolean;

    constructor(private pageLoaderService: PageLoaderService) {
        this.pageLoaderService.getLoaderListener().subscribe(value => {
            this.isShow = value;
        });
    }

    ngOnInit() {}
}
