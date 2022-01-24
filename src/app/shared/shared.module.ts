import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderToolbarComponent } from './components/header-toolbar/header-toolbar.component';
import { ButtonComponent } from './components/button/button.component';
import { FooterComponent } from './components/footer/footer.component';
import { TableComponent } from './components/table/table.component';
import { HeaderComponent } from './components/header/header.component';
import { RouterModule } from '@angular/router';
import { SelectBoxComponent } from './components/select-box/select-box.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { FormComponent } from './components/form/form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';




@NgModule({
  declarations: [
    HeaderToolbarComponent,
    ButtonComponent,
    FooterComponent,
    TableComponent,
    HeaderComponent,
    SelectBoxComponent,
    DropdownComponent,
    FormComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[
    HeaderToolbarComponent,
    ButtonComponent,
    FooterComponent,
    TableComponent,
    HeaderComponent,
    SelectBoxComponent,
    DropdownComponent,
    FormComponent
  ]
})
export class SharedModule { }
