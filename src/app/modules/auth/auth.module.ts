import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';
import { ForgetComponent } from './components/forget/forget.component';
import { ResetComponent } from './components/reset/reset.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthservicesService } from 'src/app/services/authservices.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmailVerifyComponent } from './components/email-verify/email-verify.component';


@NgModule({
  declarations: [
    AuthComponent,
    SignupComponent,
    LoginComponent,
    ForgetComponent,
    ResetComponent,
    EmailVerifyComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgSelectModule,
  ],
  providers: [AuthservicesService],
})
export class AuthModule { }
