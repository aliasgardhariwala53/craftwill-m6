import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CreateWillComponent } from './components/create-will/create-will.component';
import { ListPastWillsComponent } from './components/list-past-wills/list-past-wills.component';
import { WillComponent } from './will.component';

const routes: Routes = [
  {
    path:"",
    component:WillComponent,
    children:[
      {
        path:"",
        canActivate:[AuthGuard],
      },
      {
        path:"createWill",
        canActivate:[AuthGuard],
        component:CreateWillComponent,
      },
      {
        path:"pastWills",
        canActivate:[AuthGuard],
        component:ListPastWillsComponent,
      },
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WillRoutingModule { }
