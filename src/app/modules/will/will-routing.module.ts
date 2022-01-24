import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CreateWillComponent } from './create-will/create-will.component';
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
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WillRoutingModule { }
