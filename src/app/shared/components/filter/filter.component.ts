import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import * as moment from 'moment'
import { countries } from '../../utils/countries-store';
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  @Input() title;
  @Input() lastDate:boolean;
  
  @Input() typeFilter = false;
  @Input() countryFilter = false;
  @Input() ownershipFilter = false;
  @Input() type = [];
  @Input() country = [];
  @Input() ownershipType = [];
  @Output() formData = new EventEmitter();
  @Output() onClose= new EventEmitter();

  public countries:any = countries
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
  lowerCaseConverter(str){
    if (!str) {
      return null;
    }
    return (str.charAt(0).toLowerCase() + str.slice(1)).replace(/\s+/g, '')||'';
  }
  emitFormData(): void {
 
    const data = {
      isoDate: this.startDate.value,
      type: this.lowerCaseConverter(this.typeForm.value),
      country: this.lowerCaseConverter(this.countryForm.value),
      specifyOwnershipType: this.lowerCaseConverter(this.specifyOwnershipTypeForm.value),
    };
 
    this.formData.emit(data);
    this.onClose.emit();
  }
  ngOnInit(): void {
   
  }

}
