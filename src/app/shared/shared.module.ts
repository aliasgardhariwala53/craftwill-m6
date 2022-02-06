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
import { ClickOutsideModule } from 'ng-click-outside';
import { HeaderMenuComponent } from './components/header-menu/header-menu.component';
import { ModalComponent } from './components/modal/modal.component';
import { ModalFilterComponent } from './components/modal-filter/modal-filter.component';
import { FilterComponent } from './components/filter/filter.component';
import { NgSelectModule } from '@ng-select/ng-select';





@NgModule({
  declarations: [
    HeaderToolbarComponent,
    ButtonComponent,
    FooterComponent,
    TableComponent,
    HeaderComponent,
    SelectBoxComponent,
    DropdownComponent,
    FormComponent,
    HeaderMenuComponent,
    ModalComponent,
    ModalFilterComponent,
    FilterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    NgSelectModule,
  ],
  exports:[
    HeaderToolbarComponent,
    ButtonComponent,
    FooterComponent,
    TableComponent,
    HeaderComponent,
    SelectBoxComponent,
    DropdownComponent,
    FormComponent,
    HeaderMenuComponent,
    ModalComponent,
    ModalFilterComponent,
    FilterComponent
  ]
})
export class SharedModule { }
