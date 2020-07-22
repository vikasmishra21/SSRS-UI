import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from "../_services/authentication.service";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    user = { UserName: '', Password: '' };
    errorText = "";
  constructor(private authenticationService: AuthenticationService, private router: Router) { }


  ngOnInit() {
    this.authenticationService.Logout();
  }

  
  Submit() {
      this.errorText = "";
      this.authenticationService.Login(this.user).subscribe(
          response => {
                        // To calculate the time difference of two dates 
            var Difference_In_Time = new Date(response.PasswordExpirationOn).getTime() - new Date().getTime(); 
  
            // To calculate the no. of days between two dates 
            var Difference_In_Days = Math.floor(Difference_In_Time / (1000 * 3600 * 24)); 
            if(Difference_In_Days<=5)
            {
              var test = true;
              localStorage.setItem("isPasswordExpired", JSON.stringify(test));
              localStorage.setItem("PasswordExpiryRemaining_Days", JSON.stringify(Difference_In_Days));
            }
            
              if (response.length != 0) {
                  if(response.IsActive == 2)
                  {
                    this.errorText = "**Your account is no more active. Ask admin to activate your account."
                  }else{
                  localStorage.setItem('currentUser', JSON.stringify({ username: response.UserName }));
                  this.GetUserPermission(response.RoleID);
                // 'currentUser', );
                  }
              }
              else
                  this.errorText = "**Invalid username and password."
            
          },
          error => { console.log(error) }
      )
  }

  GetUserPermission(roleID) {
      this.authenticationService.GetUserPermissions(roleID).subscribe(
          response => {
              localStorage.setItem('Permissions', response[0].PermissionID);
              this.router.navigate(['/orders']);
          },
          error => { console.log(error) }
      )
  }


}
