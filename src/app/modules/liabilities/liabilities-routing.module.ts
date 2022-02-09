import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListLiabilitiesComponent } from './components/list-liabilities/list-liabilities.component';
import { SecuredLoanComponent } from './components/secured-loan/secured-loan.component';
import { UnsecuredLoanComponent } from './components/unsecured-loan/unsecured-loan.component';
import { PrivateDebtComponent } from './components/private-debt/private-debt.component';
import { SuccessPageLiabilitiesComponent } from './components/success-page-liabilities/success-page-liabilities.component';
import { CreateLiabilitiesComponent } from './components/create-liabilities/create-liabilities.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { LiabilitiesComponent } from './liabilities.component';
const routes: Routes = [
  {
    path:"",
    component:LiabilitiesComponent,
    children:[
      {
        path:"",
          canActivate:[AuthGuard],
        component:ListLiabilitiesComponent,
      },
      {
        path:"createLiabilities",
         canActivate:[AuthGuard],
         component:CreateLiabilitiesComponent,
       },
      {
        path:"securedLoan",
         canActivate:[AuthGuard],
         component:SecuredLoanComponent,
       },
      {
        path:"unSecuredLoan",
         canActivate:[AuthGuard],
         component:UnsecuredLoanComponent,
       },
      {
        path:"privateDebt",
         canActivate:[AuthGuard],
         component:PrivateDebtComponent,
       },
     
      {
        path:"liabilitiesSuccess",
         canActivate:[AuthGuard],
         component:SuccessPageLiabilitiesComponent,
       },

       
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiabilitiesRoutingModule { }
