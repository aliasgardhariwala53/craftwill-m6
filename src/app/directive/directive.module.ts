import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubscriptionDirective } from './subscription.directive';



@NgModule({
  declarations: [
    SubscriptionDirective
  ],
  imports: [
    CommonModule
  ],
  exports:[SubscriptionDirective]
})
export class DirectiveModule { }
