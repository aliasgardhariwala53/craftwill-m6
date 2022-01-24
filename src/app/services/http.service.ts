import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private _http : HttpClient) { }


  get(url:string):Observable<any>{
    return this._http.get<any>(url);
  }
  post(url:string, obj :object):Observable<any>{
    return this._http.post<any>(url, obj);
  }
  update(url:string, obj: object):Observable<any>{
    return this._http.put<any>(url, obj);
  }
  delete(url:string, id:string):Observable<any>{
    return this._http.delete<any>(url);
  }
}
