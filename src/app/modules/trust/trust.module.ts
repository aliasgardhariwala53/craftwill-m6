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


@NgModule({
  declarations: [
    TrustComponent,
    ListTrustComponent,
    CreateTrustComponent,
    SuccesPageTrustComponent
  ],
  imports: [
    CommonModule,
    TrustRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ClickOutsideModule
  ]
})
export class TrustModule { }
