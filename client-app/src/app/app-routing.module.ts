import { DemoComponent } from './shared/demo/demo.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: 'demo', component: DemoComponent },
  { path: '**', redirectTo: 'demo', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
