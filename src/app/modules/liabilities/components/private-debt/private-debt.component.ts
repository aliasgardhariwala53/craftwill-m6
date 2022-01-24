
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-private-debt',
  templateUrl: './private-debt.component.html',
  styleUrls: ['./private-debt.component.scss']
})
export class PrivateDebtComponent implements OnInit {

memberData=[];
key=['fullname','organisationName','Relationship'];
classes=["font-bold","font-bold","text-sm"];

  PrivateDebtForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router) { }

  createForm(){
 this.PrivateDebtForm= this._fb.group({
  dept_Name  : ["",[Validators.required]],
  current_Outstanding_Amount   : ["",[Validators.required]],
  description   : ["",[Validators.required]],
  addMembers   : [[],[Validators.required]],
 })
 this.PrivateDebtForm.valueChanges.subscribe(() => {
  this.formErrors = valueChanges(
    this.PrivateDebtForm,
    { ...this.formErrors },
    this.formErrorMessages
  );
});
  }
formErrors = {

  dept_Name: "",
  current_Outstanding_Amount: "",
  description: "",
  addMembers: "",


};

formErrorMessages = {
  dept_Name: {
    required: 'dept Name is Required',
  },
  current_Outstanding_Amount: {
    required: 'current Outstanding Amount is Required',
  },
  description: {
    required: 'Description is Required',
  },
  addMembers: {
    required: 'Please Select Members',
  },
  
};

selectMember(value){

let addMembers : Array<any> = this.PrivateDebtForm.value.addMembers;
if (addMembers.includes(value)) {
  addMembers.splice(addMembers.indexOf(value),1);
}else{
  addMembers.push(value);
}

this.PrivateDebtForm.patchValue({
  addMembers: addMembers
})
console.log(this.PrivateDebtForm.value.addMembers);
  
}
addPrivateDebt(){
  console.log(this.PrivateDebtForm);
  
  if (this.PrivateDebtForm.invalid) {
    this.PrivateDebtForm.markAllAsTouched();
    this.formErrors = valueChanges(
      this.PrivateDebtForm,
      { ...this.formErrors },
      this.formErrorMessages
    );
    console.log("invalid");
    
    return;
  }
  this._userServ.addprivateDebtLiability(this.PrivateDebtForm.value).subscribe((result) => {
    console.log(result);
    if (result.sucess) {
      this._route.navigate(['/liabilities/liabilitiesSuccess'])
        }
    this.responseMessage=result.message;
  });
 
}
  ngOnInit(): void {
    this.createForm()
    this._userServ.getPerson().subscribe((result) => {
      console.log(...result.data);
      this.memberData.push(...result.data)
      console.log(this.memberData);
     

    });
    this._userServ.getOrganisation().subscribe((result) => {
      console.log(...result.data);
      this.memberData.push(...result.data)
      console.log(this.memberData);

    });
  }

}
