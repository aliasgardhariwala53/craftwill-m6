import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';
import { CreateMembersComponent } from './components/create-members/create-members.component';
import { ListmembersComponent } from './components/listMembers/listmembers.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClickOutsideModule } from 'ng-click-outside';


@NgModule({
  declarations: [
    MembersComponent,
    CreateMembersComponent,
    ListmembersComponent
  ],
  imports: [
    CommonModule,
    MembersRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ClickOutsideModule
  ]
})
export class MembersModule { }
