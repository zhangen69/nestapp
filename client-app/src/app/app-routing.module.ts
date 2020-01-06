import { CategoryViewComponent } from './provider/category-view/category-view.component';
import { ProviderViewComponent } from './provider/provider-view/provider-view.component';
import { StockItemViewComponent } from './inventory/stock-item-view/stock-item-view.component';
import { QuotationFormComponent } from './customer/quotation-form/quotation-form.component';
import { QuotationListComponent } from './customer/quotation-list/quotation-list.component';
import { PaymentFormComponent } from './attendee/payment-form/payment-form.component';
import { CustomerViewComponent } from './customer/customer-view/customer-view.component';
import { EventPlanViewComponent } from './event/event-plan-view/event-plan-view.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { UserChangePasswordComponent } from './user/user-change-password/user-change-password.component';
import { UserFormComponent } from './user/user-form/user-form.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './auth/login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user/user-list/user-list.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './auth/reset-password/reset-password.component';
import { EventPlanListComponent } from './event/event-plan-list/event-plan-list.component';
import { EventPlanFormComponent } from './event/event-plan-form/event-plan-form.component';
import { StoreFormComponent } from './inventory/store-form/store-form.component';
import { StoreListComponent } from './inventory/store-list/store-list.component';
import { StockItemFormComponent } from './inventory/stock-item-form/stock-item-form.component';
import { StockItemListComponent } from './inventory/stock-item-list/stock-item-list.component';
import { StockTransactionListComponent } from './inventory/stock-transaction-list/stock-transaction-list.component';
import { InvoiceFormComponent } from './customer/invoice-form/invoice-form.component';
import { InvoiceListComponent } from './customer/invoice-list/invoice-list.component';
import { SupplierInvoiceListComponent } from './provider/supplier-invoice-list/supplier-invoice-list.component';
import { SupplierInvoiceFormComponent } from './provider/supplier-invoice-form/supplier-invoice-form.component';
import { ReceiptListComponent } from './provider/receipt-list/receipt-list.component';
import { ReceiptFormComponent } from './provider/receipt-form/receipt-form.component';
import { ProviderListComponent } from './provider/provider-list/provider-list.component';
import { ProviderFormComponent } from './provider/provider-form/provider-form.component';
import { ProviderServiceListComponent } from './provider/provider-service-list/provider-service-list.component';
import { ProviderServiceFormComponent } from './provider/provider-service-form/provider-service-form.component';
import { ProviderFacilityFormComponent } from './provider/provider-facility-form/provider-facility-form.component';
import { ProviderFacilityListComponent } from './provider/provider-facility-list/provider-facility-list.component';
import { PaymentVoucherListComponent } from './provider/payment-voucher-list/payment-voucher-list.component';
import { PaymentVoucherFormComponent } from './provider/payment-voucher-form/payment-voucher-form.component';
import { PaymentListComponent } from './attendee/payment-list/payment-list.component';
import { CustomerListComponent } from './customer/customer-list/customer-list.component';
import { CustomerFormComponent } from './customer/customer-form/customer-form.component';
import { CategoryFormComponent } from './provider/category-form/category-form.component';
import { CategoryListComponent } from './provider/category-list/category-list.component';
import { RegisterEventComponent } from './event/register-event/register-event.component';
import { StockTransactionFormComponent } from './inventory/stock-transaction-form/stock-transaction-form.component';

const routes: Routes = [
  {
    path: 'event-plan',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: EventPlanListComponent },
      { path: 'add', component: EventPlanFormComponent },
      { path: 'edit/:id', component: EventPlanFormComponent },
      { path: 'view/:id', component: EventPlanViewComponent }
    ]
  },
  {
    path: 'store',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: StoreListComponent },
      { path: 'add', component: StoreFormComponent },
      { path: 'edit/:id', component: StoreFormComponent }
    ]
  },
  {
    path: 'stock-item',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: StockItemListComponent },
      { path: 'add', component: StockItemFormComponent },
      { path: 'edit/:id', component: StockItemFormComponent },
      { path: 'view/:id', component: StockItemViewComponent },
    ]
  },
  {
    path: 'stock-transaction',
    canActivate: [AuthGuard],
    children: [{ path: 'list', component: StockTransactionListComponent }, { path: 'add', component: StockTransactionFormComponent }]
  },
  {
    path: 'invoice',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: InvoiceListComponent },
      { path: 'add', component: InvoiceFormComponent },
      { path: 'edit/:id', component: InvoiceFormComponent }
    ]
  },
  {
    path: 'quotation',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: QuotationListComponent },
      { path: 'add', component: QuotationFormComponent },
      { path: 'edit/:id', component: QuotationFormComponent }
    ]
  },
  {
    path: 'supplier-invoice',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: SupplierInvoiceListComponent },
      { path: 'add', component: SupplierInvoiceFormComponent },
      { path: 'edit/:id', component: SupplierInvoiceFormComponent }
    ]
  },
  {
    path: 'receipt',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ReceiptListComponent },
      { path: 'add', component: ReceiptFormComponent },
      { path: 'edit/:id', component: ReceiptFormComponent }
    ]
  },
  {
    path: 'provider',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ProviderListComponent },
      { path: 'add', component: ProviderFormComponent },
      { path: 'edit/:id', component: ProviderFormComponent },
      { path: 'view/:id', component: ProviderViewComponent },
    ]
  },
  {
    path: 'provider-service',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ProviderServiceListComponent },
      { path: 'add', component: ProviderServiceFormComponent },
      { path: 'edit/:id', component: ProviderServiceFormComponent }
    ]
  },
  {
    path: 'provider-facility',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: ProviderFacilityListComponent },
      { path: 'add', component: ProviderFacilityFormComponent },
      { path: 'edit/:id', component: ProviderFacilityFormComponent }
    ]
  },
  {
    path: 'payment-voucher',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: PaymentVoucherListComponent },
      { path: 'add', component: PaymentVoucherFormComponent },
      { path: 'edit/:id', component: PaymentVoucherFormComponent }
    ]
  },
  {
    path: 'payment',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: PaymentListComponent },
      { path: 'add', component: PaymentFormComponent },
      { path: 'edit/:id', component: PaymentFormComponent }
    ]
  },
  {
    path: 'customer',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: CustomerListComponent },
      { path: 'add', component: CustomerFormComponent },
      { path: 'edit/:id', component: CustomerFormComponent },
      { path: 'view/:id', component: CustomerViewComponent }
    ]
  },
  {
    path: 'category',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: CategoryListComponent },
      { path: 'add', component: CategoryFormComponent },
      { path: 'edit/:id', component: CategoryFormComponent },
      { path: 'view/:id', component: CategoryViewComponent },
    ]
  },
  {
    path: 'user',
    canActivate: [AuthGuard],
    children: [
      { path: 'list', component: UserListComponent },
      { path: 'add', component: UserFormComponent },
      { path: 'edit/:id', component: UserFormComponent },
      { path: 'changePassword', component: UserChangePasswordComponent },
      { path: 'profile', component: UserProfileComponent }
    ]
  },
  {
    path: 'auth',
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'forgotPassword', component: ForgotPasswordComponent },
      { path: 'resetPassword/:token', component: ResetPasswordComponent }
    ]
  },
  { path: '', component: HomeComponent },
  { path: 'register/:formId', component: RegisterEventComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
