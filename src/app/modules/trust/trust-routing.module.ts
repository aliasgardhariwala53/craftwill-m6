import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CreateTrustComponent } from './components/create-trust/create-trust.component';
import { ListTrustComponent } from './components/list-trust/list-trust.component';
import { SuccesPageTrustComponent } from './components/succes-page-trust/succes-page-trust.component';
import { TrustComponent } from './trust.component';

const routes: Routes = [
  {
    path:"",
    component:TrustComponent,
    children:[
      {
        path:"",
        canActivate:[AuthGuard],
        component:ListTrustComponent,
      },
      {
        path:"createTrust",
        canActivate:[AuthGuard],
         component:CreateTrustComponent,
       },
      {
        path:"succesTrust",
        canActivate:[AuthGuard],
         component:SuccesPageTrustComponent,
       },
      
      
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrustRoutingModule { }
