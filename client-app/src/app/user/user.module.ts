import { StandardModule } from './../standard/standard.module';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserChangePasswordComponent } from './user-change-password/user-change-password.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DisableControlDirective } from '../directives/disable-control.directive';



@NgModule({
  declarations: [
    UserChangePasswordComponent,
    UserFormComponent,
    UserListComponent,
    UserProfileComponent,
    DisableControlDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    StandardModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
  ]
})
export class UserModule { }
