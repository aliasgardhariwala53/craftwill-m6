import { Component, Input, OnInit } from '@angular/core';
import { MembersService } from 'src/app/services/members.service';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-list-clause',
  templateUrl: './list-clause.component.html',
  styleUrls: ['./list-clause.component.scss']
})
export class ListClauseComponent implements OnInit {
  memberData=[];
delayPayoutData;
 recommendedAdvisorData=[];
  finalWordsData;
 translationData;
  customClauseData;
// 1
appointBeneficiaries=[];
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  delayType='';

//2
advisorName=''
contactNumber=''
expertise=''

// 3
  constructor(private _willServices: WillService,   private memberServices: MembersService) { }
mergeById(a1, a2) {
  return a1.map((itm) => ({
    ...a2.find((item) => item._id === itm._id ),
  }));
}
  ngOnInit(): void {
    this.memberServices.getMembers().subscribe(
      (result) => {
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
        this._willServices.delayPayoutData.subscribe((value) => {
          this.delayPayoutData=value;
          console.log(value);
          
          this.delayType=value?.beneficiaryManagedBy;
          this.appointBeneficiaries =value?.appointBeneficiaries.map(el =>{
            if (el._id) {
              return el
              
            }
            return {_id:el};
          } 
          ),
          this.appointBeneficiaries=this.mergeById( this.appointBeneficiaries ,this.memberData) || [];
          console.log(this.appointBeneficiaries);
          
        });
      },
      (err) => {
      }
    );

    this._willServices.recommendedAdvisorData.subscribe((value) => {
      console.log(value);
      
      this.recommendedAdvisorData=value;

    });
    this._willServices.finalWordsData.subscribe((value) => {
      console.log(value);
      this.finalWordsData=value;
    });
    this._willServices.translationData.subscribe((value) => {
      console.log(value);
      this.translationData=value;
    });
    this._willServices.customClauseData.subscribe((value) => {
      console.log(value);
      this.customClauseData=value;
    });

  }

}
