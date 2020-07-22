import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HomeService {

  constructor(private apiService: ApiService) { }


  //Home Controller
  GetOrders(): Observable<any> {
    return this.apiService.Get('Home/GetOrders');
  }
  GetLatestActivites(type): Observable<any> {
    return this.apiService.Get('Home/GetActivities/' + type);
  }
}
