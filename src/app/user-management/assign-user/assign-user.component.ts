import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "../../_services/orders.service";
import * as _ from 'underscore';

@Component({
    selector: 'app-assign-user',
    templateUrl: './assign-user.component.html',
    styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {
    @Input()
    UserDetail: any;
    AllUsersDetail: any;
    constructor(private orderService: OrdersService, public activeModal: NgbActiveModal) { }

    formData = {
        userName: '',
        Password: '',
        RoleID: '0',
        IsActive: 1
    }

    role =
        {
            ID: 1,
            Name: 'Admin'
        }
    passwordError: string = '';
    roles: any[] = [];
    IsNewUser: boolean;

    ngOnInit() {
        if (this.UserDetail) {
            this.IsNewUser = false;
        }
        else {
            this.IsNewUser = true;
        }
        this.GetRoles();
    }

    UpdateUser(row) {
        this.orderService.UpdateUser(row, 'Role').subscribe(
            response => {
                this.activeModal.close();
            },
            error => console.log(error)
        );
    }

    GetRoles() {
        this.orderService.GetRoles().subscribe(
            response => {
                this.roles = response;
                if (!this.IsNewUser) {
                    this.SetFormData();
                }
            },
            error => { console.log(error) }
        )
    }

    SetFormData() {
        this.formData.userName = this.UserDetail['UserName'];
        const Role = _.findWhere(this.roles, { Name: this.UserDetail['Name'] });
        this.formData.RoleID = Role['ID'];
        //this.formData.IsActive = this.UserDetail['IsActive'];
    }

    checkDuplicate() {
        for (const key in this.AllUsersDetail) {
            if (this.AllUsersDetail[key].UserName.toLowerCase() == this.formData.userName.toLowerCase()) {
                return true;
            }
        }
        return false;
    }
    SaveUser() {
        if (this.IsNewUser) {
            this.passwordError = '';
            // null check also
            const roleId = parseInt(this.formData.RoleID);
            if (this.formData.Password && this.formData.userName && roleId !== 0) {
                if (!this.checkDuplicate())
{
                    if (this.checkRegex(this.formData.Password)) {
                        this.orderService.InsertUser(this.formData).subscribe(
                            response => {
                                this.activeModal.close();
                            },
                            error => { console.log(error) }
                        )
                    } else {
                        this.passwordError = "**Password must contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character."
                    }
                }else{
                    this.passwordError = "**User already registered."
                }
            } else {
                this.passwordError = "**All fields are mandatory."
            }
        } else {
            this.UpdateUser(this.formData);
        }
    }

    checkRegex(value) {
        const regexp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
        const test: boolean = regexp.test(value);
        return test;
    }


}
