import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { valueChanges } from 'src/app/helper/formerror.helper';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-create-will',
  templateUrl: './create-will.component.html',
  styleUrls: ['./create-will.component.scss', '../../../../app.component.scss']
})
export class CreateWillComponent implements OnInit {
  
  constructor( private _fb: FormBuilder,
    ) { }
  pageTitle='Personal Information';
  viewClause="listClause";
  step=3;
  setPageInfo(){
    switch (this.step) {
      case 1:
        this.pageTitle="Personal Information"
        break;
      case 2:
        this.pageTitle="Appoint Executor"
        break;
      case 3:
        this.pageTitle="Distribution Of Assets"
        break;
      case 4:
        this.pageTitle="Distribute Residual Asset"
        break;
      case 5:
        this.pageTitle="Clauses"
        break;
      case 6:
        this.pageTitle="Review"
        break;
    
      default:
        break;
    }
  }
  next(value) {
    this.step+=1;
    this.setPageInfo()
    console.log(value);
    
  }
  onbackClause(value){
  this.viewClause=value;  
  }
  back(){
    if (this.step<=1) {
      return;
    }
    if (this.step===5 && this.viewClause!=='listClause') {
      this.viewClause='listClause';
      return;
    }
    this.step=this.step-1;
    this.setPageInfo();
  }
  ngOnInit(): void {
  }

}
