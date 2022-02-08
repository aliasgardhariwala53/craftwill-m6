import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ImageCropperModule } from 'ngx-image-cropper';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    SubscriptionComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ImageCropperModule,
    NgSelectModule
  ]
})
export class HomeModule { }
