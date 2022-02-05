
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'src/app/shared/services/toastr.service';
@Component({
  selector: 'app-private-debt',
  templateUrl: './private-debt.component.html',
  styleUrls: ['./private-debt.component.scss']
})
export class PrivateDebtComponent implements OnInit {

memberData=[];

nameType='fullname' || 'organisationName'
key = [this.nameType, 'Relationship', ];
classes=["font-bold","font-bold","text-sm"];

  PrivateDebtForm:FormGroup
  responseMessage:string
  constructor(private _fb:FormBuilder,private _userServ:UserService,private _route:Router,private toastr: ToastrService) { }

  createForm(){
 this.PrivateDebtForm= this._fb.group({
  dept_Name  : ["",[Validators.required]],
  current_Outstanding_Amount   : ["",[Validators.required]],
  description   : ["",[Validators.required]],
  memberId : [[],[Validators.required]],
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
  memberId: "",


};

formErrorMessages = {
  dept_Name: {
    required: 'Dept Name is Required',
  },
  current_Outstanding_Amount: {
    required: 'Current Outstanding Amount is Required',
  },
  description: {
    required: 'Description is Required',
  },
  memberId: {
    required: 'Please Select Members',
  },
  
};

selectMember(value){

let memberId : Array<any> = this.PrivateDebtForm.value.memberId;
if (memberId.includes(value)) {
  memberId.splice(memberId.indexOf(value),1);
}else{
  memberId.push(value);
}

this.PrivateDebtForm.patchValue({
  memberId: memberId
})
console.log(this.PrivateDebtForm.value.memberId);
  
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
  const privateDebtData = {
    privateDept: this.PrivateDebtForm.value,
    type:'privateDept'
  };
  this._userServ.addLiabilities(privateDebtData).subscribe((result) => {
    console.log(result);
    if (result.success) {
      this._route.navigate(['/liabilities/liabilitiesSuccess'])
        }
        this.toastr.message(result.message,result.success);

  });
 
}
  ngOnInit(): void {
    this.createForm()
    this._userServ.getMembers().subscribe((result) => {

      this.memberData = result.data.map((item) => {
        console.log(item);
        return {...item.memberAsPerson,_id:item._id} || {...item.memberAsOrganisation,_id:item._id};
      });

    });

  }

}

