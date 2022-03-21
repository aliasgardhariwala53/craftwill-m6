import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { NgxStripeModule } from 'ngx-stripe';
import { NgxStripeModule } from 'ngx-stripe';


import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PaymentComponent } from './components/subscription/payment/payment.component';
import { NgChartsModule } from 'ng2-charts';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    SubscriptionComponent,
    PaymentComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ImageCropperModule,
    NgSelectModule,
    NgChartsModule,
    NgxStripeModule.forChild('pk_test_51KRYRcJrEVeMChFEjfcijJk7dvjXpcWG9A639LHqfUCuMirwFDpTrSpHsare5mreBAc4yeULcSjmmQoz2tgUGuTM00czLR7wI6'),
  ]
})
export class HomeModule { }
