import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'src/app/shared/services/toastr.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MembersService } from 'src/app/services/members.service';

@Component({
  selector: 'app-clauses',
  templateUrl: './clauses.component.html',
  styleUrls: ['./clauses.component.scss']
})
export class ClausesComponent implements OnInit {
  @Input() viewClause:string='listClause';
  @Output() onbackClause =new EventEmitter();
  @Output() onClickNextBtn = new EventEmitter();
  toggleModalTutorial:boolean=false;
  showClauseModal:boolean=false;
  clauseType:string='';
  delayType:string='delay1';
  translateType:string='';
  memberData = [];
  slectedDelayMember = [];
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  expertiseList=['Investment Advisor','Financial Advisor','Legal Advisor','Tax Advisor','Business Advisor','Others']
  pageTitle:string='Additional Clauses';
  backRouteStep
  constructor(
    private memberServices: MembersService,
    private spinner: NgxUiLoaderService,
    private toastr: ToastrService
  ) { }
  onSelectClause(){

  }
  selectMemberDelayPayout(value) {}
  onUpdate(value) {}
  setPageInfo(){
    this.onbackClause.emit(this.clauseType);
    switch (this.clauseType) {
      case 'clause1':
        this.pageTitle="Delayed Payout"
        this.viewClause="clause1"
        break;
      case 'clause2':
        this.pageTitle="Recommended Advisor"
        this.viewClause="clause2"
        break;
      case 'clause3':
        this.pageTitle="Final Words"
        this.viewClause="clause3"
        break;
      case 'clause4':
        this.pageTitle="Translation"
        this.viewClause="clause4"
        break;
      case 'clause5':
        this.pageTitle="Custom Clause"
        this.viewClause="clause5"
        break;

    
      default:
        break;
    }
  }
  
  onSaveDelayPayout(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    this.clauseType="";
  }
  onSaveAdvisor(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    this.clauseType="";
  }
  onSaveFinalWord(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    this.clauseType="";
  }
  onSaveCustomClause(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    this.clauseType="";
  }
  onSaveTranslation(){
    this.onbackClause.emit(this.clauseType);
    this.viewClause="listClause"
    this.clauseType="";
  }
  onClickContinue(){
    this.setPageInfo();
    console.log(this.clauseType);
    this.showClauseModal=false;
  }
  onClickNext() {
    this.onClickNextBtn.emit(3);
  }
  ngOnInit(): void {
    this.memberServices.getMembers().subscribe(
      (result) => {
        // console.log(result.data);
        this.spinner.stop();
        this.memberData = result.data.map((items, i) => {
          console.log(items);

          return {
            fullname: this.memberServices.getMembersData(items).fullname,
            Relationship:
              this.memberServices.getMembersData(items).Relationship,
            gender: this.memberServices.getMembersData(items).gender,
            id_number: this.memberServices.getMembersData(items).id_number,
            id_type: this.memberServices.getMembersData(items).id_type,
            dob: this.memberServices.getMembersData(items).dob,
            type: items.type,
            _id: items._id,
            actionRoute: 'members/createmembers',
          };
        });
        // console.log(this.allMemberData);
      },
      (err) => {
        this.spinner.stop();
        this.toastr.message('Error Getting Members data !!', false);
      }
    );
  }

}
