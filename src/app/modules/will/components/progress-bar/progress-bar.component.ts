import { Component, Input, OnInit,Output ,EventEmitter} from '@angular/core';
import { combineLatest } from 'rxjs';
import { WillService } from 'src/app/services/will.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() step=1;
  @Input() disableStep=false;
  @Output() onClickStep = new EventEmitter();
  constructor(private _willServices: WillService) { }
   arr = new Array(6);
   step1;
   step2;
   step3;
   step4;
   step5;
   onClickSteps(e){
    if (this.disableStep) {
      return;
    }
     if ( Object.keys(this.step1 ===  this.step2 === this.step3 === this.step4 === this.step5).length === 0 && e === 6) {
       return;
     }
    this.onClickStep.emit(e);
   }
  ngOnInit(): void {
    combineLatest(
      this._willServices.step1,
      this._willServices.step2,
      this._willServices.step3,
      this._willServices.step4,
      this._willServices.step5
    ).subscribe(([step1, step2, step3, step4, step5]) => {
      this.step1 = step1;
      this.step2 = step2;
      this.step3 = step3;
      this.step4 = step4;
      this.step5 = step5;
      //console.log(step1, step2, step3, step4, step5);
    });
  }

}
