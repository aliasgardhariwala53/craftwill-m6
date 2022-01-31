import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path : "",
    loadChildren : ()=>import("./modules/auth/auth.module").then(m1=>m1.AuthModule)
  },
  {
    path : "members",
    loadChildren : ()=>import("./modules/members/members.module").then(m2=>m2.MembersModule)
  },
  {
    path : "assets",
    loadChildren : ()=>import("./modules/assets/assets.module").then(m2=>m2.AssetsModule)
  },
  
  {
    path : "liabilities",
    loadChildren : ()=>import("./modules/liabilities/liabilities.module").then(m2=>m2.LiabilitiesModule)
  },
  {
    path : "will",
    loadChildren : ()=>import("./modules/will/will.module").then(m2=>m2.WillModule)
  },
  {
    path : "trust",
    loadChildren : ()=>import("./modules/trust/trust.module").then(m2=>m2.TrustModule)
  },
  {
    path : "home",
    loadChildren : ()=>import("./modules/home/home.module").then(m2=>m2.HomeModule)
  },
  {
    path:'**',
    redirectTo:'login',
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
