import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment'
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() title;
  @Input() lastDate:boolean;
  @Output() formData = new EventEmitter();

  @Input() typeFilter = false;
  @Input() countryFilter = false;
  @Input() ownershipFilter = false;
  @Input() type = [];
  @Input() country = [];
  @Input() ownershipType = [];

  @Output() onClose= new EventEmitter();

  
  startDate = new FormControl(null, [Validators.required]);
  endDate = new FormControl(moment().format('YYYY-MM-DD'), [Validators.required]);
  typeForm = new FormControl(null);
  countryForm = new FormControl(null);
  specifyOwnershipTypeForm = new FormControl(null);

  constructor() { }

   onCloseHandler(){
    this.onClose.emit();
  }
  onRestHandler(){
    const data = {
      isoDate: '',
      type: '',
      country: '',
      specifyOwnershipType:'',
    };
    this.formData.emit(data);
    this.onClose.emit();
  }
  emitFormData(): void {
 
    const data = {
      isoDate: this.startDate.value,
      type: this.typeForm.value&&(this.typeForm.value.charAt(0).toLowerCase() + this.typeForm.value.slice(1)).replace(/\s+/g, '')||'',
      country: this.countryForm.value,
      specifyOwnershipType: this.specifyOwnershipTypeForm.value
    };
 
    this.formData.emit(data);
    this.onClose.emit();
  }
  ngOnInit(): void {
   
  }

}
