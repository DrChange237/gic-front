import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { ForgotComponent } from './forgot/forgot.component';

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'forgot', component: ForgotComponent },
  { path: '', redirectTo: 'signin', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
