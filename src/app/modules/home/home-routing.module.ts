import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path:"",
    component:HomeComponent,
    children:[
   
      {
       path:"profile",
        component:ProfileComponent,
      },
      {
       path:"subscription",
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
