import { Injectable, Input } from '@angular/core';
import { ToastrService as toastrNgx } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  constructor(private toastr :toastrNgx) { }

  message(message,success){
    if (success) {
      this.toastr.success(message)
    } else {
      this.toastr.error(message)
      
    }
  }
}
