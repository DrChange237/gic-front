import { Component, OnInit } from '@angular/core';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";
import {NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectComponent} from "@ng-select/ng-select";
//
import {Cashier} from "../../shared/interfaces";
import {AuthService} from "../../core/services/auth.service";
import {CommonService} from "../../core/services/common.service";
import {SharedPipesModule} from "../../shared/pipes/shared-pipes.module";
import {SharedComponentsModule} from "../../shared/components/shared-components.module";

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss'],
  imports: [CommonModule, SharedComponentsModule, NgbNavModule, TranslatePipe, NgSelectComponent, ReactiveFormsModule, SharedPipesModule],
  standalone: true,
})
export class UserSettingsComponent implements OnInit {

  user: Cashier;

  errorMessage: string = '';
  isSubmitted: boolean;
  passwordForm: UntypedFormGroup

  constructor(
      private fb: UntypedFormBuilder,
      private authSrv: AuthService,
      private commonSrv: CommonService,
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.authSrv.getUserData().subscribe({
      next: res => { this.user = res },
      error: err => this.commonSrv.errorHandle(err, 'user.get_user_information', 'user.profile')
    });
  }

  initializeForm() {
    this.passwordForm = this.fb.group({
      secret: ['', Validators.required],
      newSecret: ['', Validators.required],
      confirmSecret: ['', Validators.required],
    })
  }

  get uf() {
    return this.passwordForm.controls;
  }

  updatePassword() {
    this.isSubmitted = true;
    const { secret, newSecret, confirmSecret } = this.passwordForm.value
    this.errorMessage = secret === newSecret
        ? 'user.new_password_identical_to_old'
        : newSecret !== confirmSecret ? 'user.new_password_not_match' : '';

    if (this.passwordForm.invalid || this.errorMessage) {
      return this.commonSrv.alert('warning', 'form.required_fields', 'user.security');
    }

    this.authSrv.updatePassword({username: this.user.username, secret, newSecret}).subscribe({
      next: () => {
        this.isSubmitted = false;
        this.passwordForm.reset();
        this.commonSrv.alert('success', 'user.update_password_successful', 'user.profile');
      },
      error: err => this.commonSrv.errorHandle(err, 'user.update_password_failed', 'user.profile')
    });
  }

}
