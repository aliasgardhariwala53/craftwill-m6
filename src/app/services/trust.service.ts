import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class TrustService {

  constructor(private _httpServe: HttpService) { }
  addTrust(obj){
    return this._httpServe.post(environment.serverUrl + "trust/storeTrust",obj);
  }
  getTrust(){
    return this._httpServe.get(environment.serverUrl + "trust/getTrustDetails");
  }
  updateTrust(obj,id){
    return this._httpServe.update(`${environment.serverUrl}trust/updateTrust/${id}`,obj);
  }
  filterTrust(obj){
    return this._httpServe.post(environment.serverUrl + "trust/filterTrust",obj);
  }
}
