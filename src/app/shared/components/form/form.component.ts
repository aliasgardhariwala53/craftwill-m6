import { Component, Input, OnInit, Output,EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {
@Input() type;
@Input() placeholder;
@Input() formData=["1","2","3"];
@Input() formErrors;
@Input() formGroup:FormGroup;
@Output() submitForm = new EventEmitter;
  constructor() { }
  ngOnInit(): void {
    console.log(this.formErrors);
  }
submit(){
  this.submitForm.emit();
}
}
