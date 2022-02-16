import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  constructor() { }
  username=new BehaviorSubject("User Name");
  image=new BehaviorSubject('');
 
}
