import { Component, Input, OnInit } from '@angular/core';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-list-clause',
  templateUrl: './list-clause.component.html',
  styleUrls: ['./list-clause.component.scss']
})
export class ListClauseComponent implements OnInit {
delayPayoutData;
 recommendedAdvisorData=[];
  finalWordsData;
 translationData;
  customClauseData;
// 1
  slectedDelayMember;
  key = ['fullname', 'Relationship'];
  classes = ['font-bold', 'font-bold', 'text-sm'];
  delayType='';

//2
advisorName=''
contactNumber=''
expertise=''

// 3
  constructor(private _willServices: WillService) { }

  ngOnInit(): void {
    this._willServices.delayPayoutData.subscribe((value) => {
      this.delayPayoutData=value;
      console.log(value);
      
      this.delayType=value['delayType'];
      this.slectedDelayMember=value['slectedDelayMember'];
    });
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
