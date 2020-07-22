import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../_services/orders.service";
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthenticationService } from "../_services/authentication.service";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

    constructor(private authenticationService: AuthenticationService, public activeModal: NgbActiveModal) { }

    isPasswordExpiring = JSON.parse(localStorage.getItem("isPasswordExpired"));
    PasswordExpiryRemaining_Days = JSON.parse(localStorage.getItem("PasswordExpiryRemaining_Days"));
    isPasswordExpired = false;
    formData = {
        oldPassword: '',
        newPassword: '',
        reNewPassword: ''
    }

    errorText = '';
    ngOnInit() {
        if(this.isPasswordExpiring==null || this.isPasswordExpiring==undefined)
        {
            this.isPasswordExpiring=false;
        }
        if(Math.sign(this.PasswordExpiryRemaining_Days)<=0)
        {
            this.isPasswordExpired=true;
        }
    }

    Save() {
        this.errorText = '';
        if (this.formData.newPassword && this.formData.oldPassword && this.formData.reNewPassword) {
            if (this.formData.newPassword == this.formData.reNewPassword) {
                if(this.checkRegex(this.formData.newPassword)){
                let credentials = {};
                let user = JSON.parse(localStorage.getItem('currentUser'));
                
                credentials['UserName'] = user['username'];
                credentials['Password'] = this.formData.oldPassword;
                credentials['NewPassword'] = this.formData.newPassword;
                this.authenticationService.ChangePassword(credentials).subscribe(
                    response => {
                        if (response == 1)
                            this.activeModal.close();
                        else
                            this.errorText = "**Old password doesn't match with your existing password.";
                    },
                    error => { console.log(error) }
                )
            }
            else{
                this.errorText = "**Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
            }
        }
            else
                this.errorText = "**New password and Confirm password must have same values.";
        }
        else
            this.errorText = "**All fields are mandatory.";

    }

    
    checkRegex(value) {
        const regexp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
        const test: boolean = regexp.test(value);
        return test;
    }

}
