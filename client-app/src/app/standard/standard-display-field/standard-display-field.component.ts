import { TitleDisplayPipe } from 'src/app/pipes/title-display.pipe';
import { Component, OnInit, Input } from '@angular/core';
import { IStandardDisplayField } from '../standard.interface';

@Component({
  selector: 'app-standard-display-field',
  templateUrl: './standard-display-field.component.html',
  styleUrls: ['./standard-display-field.component.css']
})
export class StandardDisplayFieldComponent implements OnInit {
  @Input() field: IStandardDisplayField;
  @Input() formData: any;

  constructor(private titleDisplayPipe: TitleDisplayPipe) {}

  ngOnInit() {
    if (!this.field.displayName) {
      this.field.displayName = this.titleDisplayPipe.transform(this.field.name);
    }
  }

  getDisplayValue(field, formData) {
    if (!formData) {
      return;
    }

    if (field.getValue) {
      return field.getValue(formData);
    } else if (field.name.includes('.')) {
      let thisVal = formData;
      field.name.split('.').forEach(ele => {
        if (!thisVal) {
          return;
        }
        thisVal = thisVal[ele];
      });
      return thisVal;
    } else {
      return formData[field.name];
    }
  }
}
