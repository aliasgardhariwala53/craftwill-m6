import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrustRoutingModule } from './trust-routing.module';
import { TrustComponent } from './trust.component';
import { ListTrustComponent } from './components/list-trust/list-trust.component';
import { CreateTrustComponent } from './components/create-trust/create-trust.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SuccesPageTrustComponent } from './components/succes-page-trust/succes-page-trust.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { CreateInfoTrustComponent } from './components/create-info-trust/create-info-trust.component';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    TrustComponent,
    ListTrustComponent,
    CreateTrustComponent,
    SuccesPageTrustComponent,
    CreateInfoTrustComponent
  ],
  imports: [
    CommonModule,
    TrustRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ClickOutsideModule,
    NgSelectModule
  ]
})
export class TrustModule { }
