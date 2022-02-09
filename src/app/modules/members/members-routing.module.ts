import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { CreateMembersComponent } from './components/create-members/create-members.component';
import { ListmembersComponent } from './components/listMembers/listmembers.component';
import { MembersComponent } from './members.component';

const routes: Routes = [

  {
    path:"",
    component:MembersComponent,
    children:[
      {
        path:"",
        canActivate:[AuthGuard],
        component:ListmembersComponent,
      },
      {
        path:"createmembers",
        canActivate:[AuthGuard],
         component:CreateMembersComponent,
       },

      
       
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MembersRoutingModule { }
