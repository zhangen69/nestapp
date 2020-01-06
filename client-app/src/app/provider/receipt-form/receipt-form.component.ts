import { DialogFormComponent } from './../../templates/dialog-form/dialog-form.component';
import { Component, OnInit } from '@angular/core';
import { IStandardFormField } from '../../standard/standard.interface';
import { MatDialog } from '@angular/material/dialog';
import { of, merge, forkJoin } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-receipt-form',
    templateUrl: './receipt-form.component.html',
    styleUrls: ['./receipt-form.component.css']
})
export class ReceiptFormComponent implements OnInit {
    formData: any;
    includes = ['provider', 'supplierInvoice'];
    fields: IStandardFormField[] = [
        // { name: 'code', type: 'string', required: true },
        { name: 'provider', type: 'ref', required: true },
        { name: 'store', type: 'ref', required: true },
        // { name: 'supplierInvoice', type: 'ref', refName: 'code' },
        { name: 'remarks', type: 'textarea' },
        {
            name: 'lines',
            type: 'table',
            add: array => {
                this.addReceiptItem(array);
            },
            displayName: 'Receipt Items',
            childName: 'Receipt Item',
            default: [],
            fields: [
                { name: 'name', type: 'string', reuqired: true },
                { name: 'unit', type: 'string', reuqired: true },
                { name: 'unitPrice', displayName: 'U/Price (RM)', type: 'number', reuqired: true },
                { name: 'quantity', type: 'number', reuqired: true }
            ]
        }
    ];

    constructor(private dialog: MatDialog, private http: HttpClient, private router: Router) {}

    ngOnInit() {}

    addReceiptItem(array) {
        const formData = { ...this.formData };
        const fields = [
            {
                name: 'stockItem',
                displayName: 'Enter stock item name',
                type: 'ref',
                refIncludes: ['category']
            }
        ];

        const dialogRef = this.dialog.open(DialogFormComponent, {
            width: 'auto',
            minWidth: '50vw',
            maxHeight: '99vh',
            data: { data: formData, fields, title: 'Add Stock Item', callback: true }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (!result) {
                return;
            }
            // do something here
            of(result)
                .pipe(
                    map(item => item.stockItem),
                    tap(stockItem =>
                        array.push({ stockItem: stockItem, name: stockItem.name, unit: stockItem.unit, unitPrice: stockItem.unitPrice })
                    )
                )
                .subscribe();
        });
    }

    afterSubmit(receipt) {
        const apis = [];
        receipt.lines.forEach(line => {
            const stockTransactionModel = {
                quantity: line.quantity,
                stockItem: line.stockItem._id,
                store: receipt.store,
                event: null,
                receipt: receipt._id,
                type: 'StockIn',
                stockItemName: line.stockItem.name,
                stockItemUnit: line.stockItem.unit,
                stockItemUnitPrice: line.stockItem.unitPrice,
                stockItemCategory: line.stockItem.category
            };
            apis.push(this.http.post(environment.apiUrl + '/service/stock-transaction', stockTransactionModel));
        });
        forkJoin(apis).subscribe((results) => this.router.navigate(['/receipt/list']));
    }
}
