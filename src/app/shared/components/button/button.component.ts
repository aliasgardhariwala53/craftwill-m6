import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {
  @Input() value:string='';
  @Input() id:string='';
  @Input() arrow:boolean;
  @Input() routelink:string='';
  @Input() padding:string='px-3 py-3';
  @Input() margin:string='';
  @Input() borderRadius:string='rounded-[10px]';
  @Input() backgroundColor:string='bg-[#FF6782]';
  @Input() color:string='text-white';
  @Output() myMethod= new EventEmitter();
  constructor(private route:Router) { }

  ngOnInit(): void {
  }
  onClick(){
 this.myMethod.emit();
 if (this.routelink!=='') {
   this.route.navigate([this.routelink]);
   return;
 }
}
}
