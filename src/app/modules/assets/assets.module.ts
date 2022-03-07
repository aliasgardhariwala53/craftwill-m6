import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssetsComponent } from './assets.component';
import { AssetsRoutingModule } from './assets-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusinessComponent } from './components/business/business.component';
import { CreateAssetsComponent } from './components/create-assets/create-assets.component';
import { ListAssetsComponent } from './components/list-assets/list-assets.component';
import { InvestmentAccountComponent } from './components/investment-account/investment-account.component';
import { InsurancePolicyComponent } from './components/insurance-policy/insurance-policy.component';
import { RealEstateComponent } from './components/real-estate/real-estate.component';
import { MoterVehicleComponent } from './components/moter-vehicle/moter-vehicle.component';
import { IntellectualPropertyComponent } from './components/intellectual-property/intellectual-property.component';
import { PersonalPossessionComponent } from './components/personal-possession/personal-possession.component';
import { SafeDepositBoxComponent } from './components/safe-deposit-box/safe-deposit-box.component';

import { SuccessPageAssetsComponent } from './components/success-page-assets/success-page-assets.component';
import { BankAccountUserComponent } from './components/bank-account-user/bank-account-user.component';
import { HttpClientModule } from '@angular/common/http';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { OtherAssetsComponent } from './components/other-assets/other-assets.component';


@NgModule({
  declarations: [
    AssetsComponent,
    BusinessComponent,
    CreateAssetsComponent,
    ListAssetsComponent,
    BankAccountUserComponent,
    InvestmentAccountComponent,
    InsurancePolicyComponent,
    BusinessComponent,
    RealEstateComponent,
    MoterVehicleComponent,
    IntellectualPropertyComponent,
    PersonalPossessionComponent,
    SafeDepositBoxComponent,
    SuccessPageAssetsComponent,
    OtherAssetsComponent,
   
  ],
  imports: [
    CommonModule,
    AssetsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ClickOutsideModule,
    NgxSpinnerModule,
    NgSelectModule
  ]
})
export class AssetsModule { }
