import { StandardDisplayFieldComponent } from './standard/standard-display-field/standard-display-field.component';
import { MaterialModule } from './material.module';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { FileUploadModule } from 'ng2-file-upload';
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfirmationDialogComponent } from './templates/confirmation-dialog/confirmation-dialog.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './user/user-list/user-list.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { DisableControlDirective } from './directives/disable-control.directive';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserChangePasswordComponent } from './user/user-change-password/user-change-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { RoleFormComponent } from './role/role-form/role-form.component';
import { RoleListComponent } from './role/role-list/role-list.component';
import { StandardListComponent } from './standard/standard-list/standard-list.component';
import { DatePipe, CurrencyPipe, CommonModule } from '@angular/common';
import { StandardFormComponent } from './standard/standard-form/standard-form.component';
import { StandardFormFieldComponent } from './standard/standard-form-field/standard-form-field.component';
import { StandardFilterComponent } from './standard/standard-filter/standard-filter.component';
import { TitleDisplayPipe } from './pipes/title-display.pipe';
import { PageLoaderComponent } from './templates/page-loader/page-loader.component';
import { QRCodeModule } from 'angularx-qrcode';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { DialogFormComponent } from './templates/dialog-form/dialog-form.component';
import { EntityDataModule } from '@ngrx/data';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { AppEffects } from './app.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FilterOptionsPipe } from './standard/filter-options.pipe';
import { GetTotalPipe } from './pipes/get-total.pipe';
import { ObjectToArrayPipe } from './standard/to-array.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ConfirmationDialogComponent,
    LoginComponent,
    RegisterComponent,
    HeaderComponent,
    HomeComponent,
    UserListComponent,
    UserFormComponent,
    DisableControlDirective,
    ForgotPasswordComponent,
    UserProfileComponent,
    UserChangePasswordComponent,
    ResetPasswordComponent,
    RoleFormComponent,
    RoleListComponent,
    StandardListComponent,
    StandardFormComponent,
    StandardFormFieldComponent,
    StandardFilterComponent,
    TitleDisplayPipe,
    PageLoaderComponent,
    DialogFormComponent,
    FilterOptionsPipe,
    GetTotalPipe,
    ObjectToArrayPipe,
    StandardDisplayFieldComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    FileUploadModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right'
    }),
    MaterialModule,
    QRCodeModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    EntityDataModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    EffectsModule.forRoot([AppEffects]),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production }),
  ],
  entryComponents: [ConfirmationDialogComponent, DialogFormComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    DatePipe,
    CurrencyPipe,
    TitleDisplayPipe,
    GetTotalPipe,
    Title,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
