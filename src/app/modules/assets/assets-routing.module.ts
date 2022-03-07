import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { AssetsComponent } from './assets.component';
import { BankAccountUserComponent } from './components/bank-account-user/bank-account-user.component';
import { BusinessComponent } from './components/business/business.component';
import { CreateAssetsComponent } from './components/create-assets/create-assets.component';
import { InsurancePolicyComponent } from './components/insurance-policy/insurance-policy.component';
import { IntellectualPropertyComponent } from './components/intellectual-property/intellectual-property.component';
import { InvestmentAccountComponent } from './components/investment-account/investment-account.component';
import { ListAssetsComponent } from './components/list-assets/list-assets.component';
import { MoterVehicleComponent } from './components/moter-vehicle/moter-vehicle.component';
import { OtherAssetsComponent } from './components/other-assets/other-assets.component';
import { PersonalPossessionComponent } from './components/personal-possession/personal-possession.component';
import { RealEstateComponent } from './components/real-estate/real-estate.component';
import { SafeDepositBoxComponent } from './components/safe-deposit-box/safe-deposit-box.component';
import { SuccessPageAssetsComponent } from './components/success-page-assets/success-page-assets.component';


const routes: Routes = [
  {
    path:"",
    component:AssetsComponent,
    children:[
      {
        path:"",
        canActivate:[AuthGuard],
        component:ListAssetsComponent,
      },
      {
        path:"createAssets",
        canActivate:[AuthGuard],
         component:CreateAssetsComponent,
       },
       {
        path:"addBank",
        canActivate:[AuthGuard],
         component:BankAccountUserComponent,
       },
 
       {
        path:"investmentAccount",
        canActivate:[AuthGuard],
         component:InvestmentAccountComponent,
       },
       {
        path:"insurancePolicy",
        canActivate:[AuthGuard],
         component:InsurancePolicyComponent,
       },
       {
        path:"business",
        canActivate:[AuthGuard],
         component:BusinessComponent,
       },
       {
        path:"realEstate",
        canActivate:[AuthGuard],
         component:RealEstateComponent,
       },
       {
        path:"moterVehicle",
        canActivate:[AuthGuard],
         component:MoterVehicleComponent,
       },
       {
        path:"intellectualProperty",
        canActivate:[AuthGuard],
         component:IntellectualPropertyComponent,
       },
       {
        path:"personalPossession",
        canActivate:[AuthGuard],
         component:PersonalPossessionComponent,
       },
       {
        path:"safeDeposit",
        canActivate:[AuthGuard],
         component:SafeDepositBoxComponent,
       },
       {
        path:"otherAssets",
        canActivate:[AuthGuard],
         component:OtherAssetsComponent,
       },
       {
        path:"assetsuccess",
        canActivate:[AuthGuard],
         component:SuccessPageAssetsComponent,
       },
       
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsRoutingModule { }
