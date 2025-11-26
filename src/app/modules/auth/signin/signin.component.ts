import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
//
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import {CommonService} from "../../../core/services/common.service";
import {AuthService} from "../../../core/services/auth.service";
import {finalize} from "rxjs";
import {Language} from "../../../shared/enums";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations],
    standalone: false
})
export class SigninComponent implements OnInit {
    loading: boolean;
    loadingText: string;
    signinForm: UntypedFormGroup;
    alert: { show: boolean, message: string, type: string } = {
        show: false,
        message: '',
        type: ''
    };

    protected languages: string[] = Object.values(Language);

    constructor(
        private fb: UntypedFormBuilder,
        private auth: AuthService,
        private router: Router,
        public commonSrv: CommonService
    ) { }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = this.commonSrv.translate.instant('btn.loading_request');

                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });

        this.signinForm = this.fb.group({
            email: ['admin@cca-bank.com', Validators.required],
            password: ['12345', Validators.required]
        });
    }

    changeLanguage(code: string) {
        this.commonSrv.toggleLanguage(code);
        window.location.reload();
    }

    signIn() {
        if (this.signinForm.invalid) {
            this.alert = { show: true, message: 'form.bad_credentials', type: 'danger' }
            return;
        }

        this.loading = true;
        this.loadingText = this.commonSrv.translate.instant('sessions.signing_in');
        const data = {
            username: this.signinForm.value?.email as string,
            password: this.signinForm.value?.password || ''
        };

        this.auth.signIn(data).pipe(finalize(() => this.loading = false ))
            .subscribe({
                next: () => {
                    this.alert = { show: false, message: '', type: 'success' };
                    this.commonSrv.alert('success', 'sessions.sign_in_success', 'sessions.session');
                    this.router.navigateByUrl('/dashboard');
                },
                error: err => {
                    this.alert = { show: true, message: err?.error?.message || 'sessions.sign_in_failed', type: 'danger' };
                    this.commonSrv.errorHandle(err, 'sessions.sign_in_failed', 'sessions.session');
                },
        });
    }
}
