import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StandardListComponent } from './standard-list/standard-list.component';
import { StandardFormComponent } from './standard-form/standard-form.component';
import { StandardFormFieldComponent } from './standard-form-field/standard-form-field.component';
import { StandardFilterComponent } from './standard-filter/standard-filter.component';
import { StandardDisplayFieldComponent } from './standard-display-field/standard-display-field.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FilterOptionsPipe } from './filter-options.pipe';
import { TitleDisplayPipe } from '../pipes/title-display.pipe';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    StandardListComponent,
    StandardFormComponent,
    StandardFormFieldComponent,
    StandardFilterComponent,
    StandardDisplayFieldComponent,
    FilterOptionsPipe,
    TitleDisplayPipe,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatSelectModule,
    MatListModule,
    MatTooltipModule,
    MatInputModule,
    MatButtonModule,
  ],
  exports: [
    StandardListComponent,
    StandardFormComponent,
    StandardFormFieldComponent,
    StandardFilterComponent,
    StandardDisplayFieldComponent,
  ],
})
export class StandardModule {}
