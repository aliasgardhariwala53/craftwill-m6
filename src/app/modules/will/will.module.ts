import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WillRoutingModule } from './will-routing.module';
import { WillComponent } from './will.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListPastWillsComponent } from './components/list-past-wills/list-past-wills.component';
import { CreateWillComponent } from './components/create-will/create-will.component';
import { MyWillComponent } from './components/my-will/my-will.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { PersonalInformationComponent } from './components/personal-information/personal-information.component';
import { AppointExecutorComponent } from './components/appoint-executor/appoint-executor.component';
import { DistributionAssetsComponent } from './components/distribution-assets/distribution-assets.component';
import { DistributeResidualAssetComponent } from './components/distribute-residual-asset/distribute-residual-asset.component';
import { ClausesComponent } from './components/clauses/clauses.component';
import { ListClauseComponent } from './components/list-clause/list-clause.component';
import { ReviewWillComponent } from './components/review-will/review-will.component';



@NgModule({
  declarations: [
    WillComponent,
    CreateWillComponent,
    ListPastWillsComponent,
    MyWillComponent,
    ProgressBarComponent,
    PersonalInformationComponent,
    AppointExecutorComponent,
    DistributionAssetsComponent,
    DistributeResidualAssetComponent,
    ClausesComponent,
    ListClauseComponent,
    ReviewWillComponent,
  ],
  imports: [
    CommonModule,
    WillRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgSelectModule
  ]
})
export class WillModule { }
