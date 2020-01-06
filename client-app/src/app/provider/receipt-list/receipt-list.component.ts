import { IStandardColumn } from 'src/app/standard/standard.interface';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-receipt-list',
    templateUrl: './receipt-list.component.html',
    styleUrls: ['./receipt-list.component.css']
})
export class ReceiptListComponent implements OnInit {
    includes: string[] = ['provider', 'supplierInvoice'];
    columns: IStandardColumn[] = [
        { name: 'code', width: '100px' },
        { name: 'provider.name', displayName: 'Provider', format: 'link', link: item => item.provider ? '/provider/view/' + item.provider._id : '' },
        { name: 'totalAmount', format: 'template', template: item => item.lines.length > 0 ? item.lines.reduce((acc, line) => acc + ((line.unitPrice || 0) * (line.quantity || 0)), 0) : 0 },
        { name: 'remarks' },
        { name: 'audit.updatedDate', displayName: 'Updated', type: 'date' }
    ];
    filterList = [
        { type: 'code', displayName: 'Code', queryType: 'string' }
    ];

    constructor() {}

    ngOnInit() {}
}
