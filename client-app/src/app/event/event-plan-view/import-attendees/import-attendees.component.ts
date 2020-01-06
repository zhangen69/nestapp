import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Inject } from '@angular/core';
import * as XLSX from 'xlsx';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

type AOA = any[][];

@Component({
  selector: 'app-import-attendees',
  templateUrl: './import-attendees.component.html',
  styleUrls: ['./import-attendees.component.css']
})
export class ImportAttendeesComponent implements OnInit {
  excelData: any;
  jsonData = [];
  eventPlan: any;
  // ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.excelData);


  constructor(
    private dialogRef: MatDialogRef<any>, private http: HttpClient, @Inject(MAT_DIALOG_DATA) public params: any) { }

  ngOnInit() {
    this.eventPlan = this.params.eventPlan;
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }
    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      /* read workbook */
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      /* grab first sheet */
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.excelData = <AOA>(XLSX.utils.sheet_to_json(ws, { header: 1 }));
      this.onLoadExcelData();
    };
    reader.readAsBinaryString(target.files[0]);
  }

  onLoadExcelData() {
    if (this.excelData) {
      const headers = this.excelData[0].map((ele) => {
        return {
          displayName: ele,
          name: ele.replace(/(^[A-Z])/, (str) => str.toLowerCase()).replace(/\s/g, ''),
        };
      });
      const body = this.excelData.filter((ele) => ele !== this.excelData[0] && (Object.keys(ele).some(key => ele[key])));

      from(body).pipe(
        map((row) => {
          const rowData = {};
          headers.forEach((header, index) => rowData[header.name] = row[index]);
          return rowData;
        })
      ).subscribe({
        next: (val) => {
          this.jsonData.push(val);
        }
      });
    }
  }

  onImportData(attendees: any[]): void {
    this.eventPlan.attendees.push.apply(this.eventPlan.attendees, attendees);
    const updateEventPlan$ = this.http.put(environment.apiUrl + '/service/event-plan', this.eventPlan).subscribe({
      next: (res) => {
        this.dialogRef.close(res);
      },
      complete: () => {
        updateEventPlan$.unsubscribe();
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close({ dismiss: true });
  }

}
