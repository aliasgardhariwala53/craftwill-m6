import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path:"",
    canActivate:[AuthGuard],
    component:HomeComponent,
    children:[
   
      {
       path:"profile",
       canActivate:[AuthGuard],
        component:ProfileComponent,
      },
      {
       path:"subscription",
       canActivate:[AuthGuard],
        component:SubscriptionComponent,
      },

    ]

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
