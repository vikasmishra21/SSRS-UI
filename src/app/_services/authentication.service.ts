import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { User } from "../_models/models";
import { Observable } from "rxjs/Observable";
import { locale } from "moment";
import { Subject } from "rxjs/Subject";

@Injectable()
export class AuthenticationService {
  constructor(private apiService: ApiService) {}
  private checkbool: Subject<boolean> = new Subject<boolean>();

  Login(user: User) {
    // return this.apiService.Post('Users/authenticate', user).subscribe(
    //   response => {
    //     if (response) {
    //       // store user details and jwt token in local storage to keep user logged in between page refreshes
    //       localStorage.setItem('currentUser', JSON.stringify(response));
    //     }
    //     return response;
    //   },
    //   error => console.log(error));

    return this.apiService.Post("users/Authenticate", user);
    // response => {
    //     if (response) {
    //         return response;
    //     }
    //}
    //if (user.username.toLowerCase() == 'admin' && user.password == 'ssrs@123') {
    //  localStorage.setItem('currentUser', JSON.stringify({ username: 'Admin' }));
    //  return true;
    //} else
    // return false;
  }

  ChangePassword(data: any) {
    return this.apiService.Post("users/ChangePassword", data);
  }
  setboolval(el) {
    this.checkbool.next(el);
  }
  getboolval(): Observable<any> {
    return this.checkbool.asObservable();
  }
  Logout() {
    // remove user from local storage to log user out
    localStorage.clear();
    // localStorage.removeItem('currentUser');
    sessionStorage.clear();
  }

  GetUserPermissions(roleID: number) {
    return this.apiService.Get("roles/" + roleID);
  }

  GetCurrentUserInfo(): any {
    return JSON.parse(localStorage.getItem("currentUser"));
  }
}
