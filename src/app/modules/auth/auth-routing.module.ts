import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { ForgetComponent } from './components/forget/forget.component';
import { LoginComponent } from './components/login/login.component';
import { ResetComponent } from './components/reset/reset.component';
import { SignupComponent } from './components/signup/signup.component';

const routes: Routes = [
  {
    path : "",
    component : AuthComponent,
    children  : [
      {
        path : "",
        redirectTo:"login",
      },
      {
        path : "login",
        component: LoginComponent,
      },
      {
        path:'signup',
        component:SignupComponent,
      
      },
      {
        path:'forgetPassword',
        component:ForgetComponent,
      },
      {
        path:"resetpassword/:id",
        component:ResetComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
