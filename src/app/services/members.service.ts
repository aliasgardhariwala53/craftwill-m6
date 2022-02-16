import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class MembersService {

  constructor(private _httpServe: HttpService) { }
  createMembers(obj){
    return this._httpServe.post(environment.serverUrl + "createMember",obj);
  }
  filterMembers(obj){
    return this._httpServe.post(environment.serverUrl + "filterMembers",obj);
  }
  getMembers(){
    return this._httpServe.get(environment.serverUrl + "getMembers");
  }
  updateMembers(obj,id){
    return this._httpServe.update(`${environment.serverUrl}updateMember/${id}`,obj);
  }
  getMembersData(item) {
    let data = {
      fullname: '',
      Relationship: '',
      gender: '',
      id_type: '',
      id_number: '',
      dob: '',
    };
    switch (item.type) {
      case 'memberAsPerson':
        data.fullname = item.memberAsPerson.fullname || '';
        data.Relationship = item.memberAsPerson.Relationship || '---';
        data.gender = item.memberAsPerson.gender || '';
        data.id_type = item.memberAsPerson.id_type || '';
        data.id_number = item.memberAsPerson.id_number || '';
        data.dob = item.memberAsPerson.dob || '';

        return data;
        break;
      case 'memberAsOrganisation':
        data.Relationship = '---';
        data.fullname = item.memberAsOrganisation.organisationName || '';
        data.gender = item.memberAsOrganisation.gender || 'NA';
        data.id_type = item.memberAsOrganisation.gender || 'NA';
        data.id_number = item.memberAsOrganisation.registration_number || '';
        data.dob = item.memberAsOrganisation.dob || 'NA';
        return data;
        break;

      default:
        return data;
    }
  }
}
