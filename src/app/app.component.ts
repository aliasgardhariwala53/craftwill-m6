import { Component } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { filter, pairwise } from 'rxjs';
import { PreviousRouteService } from './services/previous-route.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';
  constructor(
    private _route: Router,
    private _previousRoute: PreviousRouteService
  ) {

   
  }
  ngOnInit(): void {  
    this._route.events
    .pipe(filter((e: any) => e instanceof RoutesRecognized),
      pairwise()
    ).subscribe((e: any) => {
      localStorage.setItem('previousRoute',e[0].urlAfterRedirects);
      this._previousRoute.previousRoute.next(e[0].urlAfterRedirects);
    });
    if (localStorage.getItem('previousRoute')!=='' || localStorage.getItem('previousRoute')!==null) {
      this._previousRoute.previousRoute.next(localStorage.getItem('previousRoute'))
    }
}
}
