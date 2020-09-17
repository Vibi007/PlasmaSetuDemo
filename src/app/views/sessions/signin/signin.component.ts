import { Component, OnInit } from '@angular/core';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { ToastrService } from "ngx-toastr";
import { SignInService } from './services/signin.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss'],
    animations: [SharedAnimations]
})
export class SigninComponent implements OnInit {
    loading: boolean;
    loadingText: string;
    signinForm: FormGroup;
    constructor(
        private router: Router,
        private fb: FormBuilder,
        private auth: AuthService,
        private toastr: ToastrService,
        private signinService: SignInService,
        private _cookieService: CookieService
    ) {
        this.signinForm = this.fb.group({
            email: ['', Validators.compose([
                Validators.required
            ])],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.router.events.subscribe(event => {
            if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
                this.loadingText = 'Loading Dashboard Module...';

                this.loading = true;
            }
            if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
                this.loading = false;
            }
        });
    }

    signin(formdata: FormData) {
        this.loading = true;
        this.loadingText = 'Sigining in...';
        localStorage.setItem('token', 'token');
        this.toastr.clear();
        // this.toastr.success('Logged in successfuly', "Success!", { progressBar: true });
        setTimeout(() => {
            this.loading = false;
            this.router.navigateByUrl('/sessions/signup');
        }, 500);

        /*  this.auth.signin(this.signinForm.value)
             .subscribe(res => {
                 if (res) {
                     localStorage.setItem('token', res['token']);
                     this.toastr.clear();
                     this.toastr.success('Logged in successfuly', "Success!", { progressBar: true });
                     this.router.navigateByUrl('/dashboard/v4');
                     this.loading = false;
                 }
             },
                 error => {
                     this.loading = false;
                     this.loadingText = '';
                 }); */
    }

}
