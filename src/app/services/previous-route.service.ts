import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  constructor() { }
  previousRoute=new BehaviorSubject('');
}
