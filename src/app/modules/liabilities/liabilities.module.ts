import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiabilitiesRoutingModule } from './liabilities-routing.module';
import { LiabilitiesComponent } from './liabilities.component';
import { ListLiabilitiesComponent } from './components/list-liabilities/list-liabilities.component';
import { CreateLiabilitiesComponent } from './components/create-liabilities/create-liabilities.component';
import { SecuredLoanComponent } from './components/secured-loan/secured-loan.component';
import { UnsecuredLoanComponent } from './components/unsecured-loan/unsecured-loan.component';
import { PrivateDebtComponent } from './components/private-debt/private-debt.component';
import { SuccessPageLiabilitiesComponent } from './components/success-page-liabilities/success-page-liabilities.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HeaderToolbarComponent } from 'src/app/shared/components/header-toolbar/header-toolbar.component';
import { ClickOutsideModule } from 'ng-click-outside';


@NgModule({
  declarations: [
    LiabilitiesComponent,
    ListLiabilitiesComponent,
    CreateLiabilitiesComponent,
    SecuredLoanComponent,
    UnsecuredLoanComponent,
    PrivateDebtComponent,
    SuccessPageLiabilitiesComponent
  ],
  imports: [
    CommonModule,
    LiabilitiesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ClickOutsideModule
    
  ]
})
export class LiabilitiesModule { }
