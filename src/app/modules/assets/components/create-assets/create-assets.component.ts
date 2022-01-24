import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss']
})
export class CreateAssetsComponent implements OnInit {
  Titile:string='Assets';
  constructor() { }

  ngOnInit(): void {
  }

}
