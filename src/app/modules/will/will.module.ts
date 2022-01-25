import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WillRoutingModule } from './will-routing.module';
import { WillComponent } from './will.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListPastWillsComponent } from './components/list-past-wills/list-past-wills.component';
import { CreateWillComponent } from './components/create-will/create-will.component';


@NgModule({
  declarations: [
    WillComponent,
    CreateWillComponent,
    ListPastWillsComponent
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
