import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WillRoutingModule } from './will-routing.module';
import { WillComponent } from './will.component';
import { CreateWillComponent } from './create-will/create-will.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    WillComponent,
    CreateWillComponent
  ],
  imports: [
    CommonModule,
    WillRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ]
})
export class WillModule { }
