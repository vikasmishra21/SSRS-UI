import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ManageRoleComponent } from '../../user-management/manage-role/manage-role.component';
import { AssignUserComponent } from '../../user-management/assign-user/assign-user.component';
import { OrdersService } from "../../_services/orders.service";
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";

@Component({
    selector: 'app-users-grid',
    templateUrl: './users-grid.component.html',
    styleUrls: ['./users-grid.component.css']
})
export class UsersGridComponent implements OnInit {
    gridData = {
        data: [],
        columnconfig: [
            { prop: 'Edit', as: 'Edit', cellTemplate: DataTableTemplates.Custom, template: this.EditTemplate.bind(this) },
            { prop: 'Deactivate', as: 'Active/Deactive', cellTemplate: DataTableTemplates.Custom, template: this.DeactivateTemplate.bind(this) },
            { prop: 'UserName', as: 'UserName' },
            { prop: 'Name', as: 'Role' },
            { prop: 'IsActive', as: 'Status', cellTemplate: DataTableTemplates.Custom, template: this.StatusTemplate.bind(this) }
        ],
        events: {
            rowClicked: this.gridRowClicked.bind(this)
        },
        settings: {
            search: true,
        }
    };
    constructor(private orderService: OrdersService, private modalService: NgbModal) { }

    ngOnInit() {
        this.GetUsers();
    }

    GetUsers() {
        this.orderService.GetUsers().subscribe(
            response => { this.gridData.data = response; },
            error => console.log(error)
        );
    }

    ManageRole() {
        const modalRef = this.modalService.open(ManageRoleComponent, { size: "sm" });
        modalRef.componentInstance.UserRoleData = this.gridData.data;
        modalRef.result.then((result) => {

        }, (reason) => {

        });

    }

    OpenAddNewUser(row) {
        const modalRef = this.modalService.open(AssignUserComponent, { size: "sm" });
        modalRef.componentInstance.UserDetail = row;
        modalRef.componentInstance.AllUsersDetail = this.gridData.data;
        modalRef.result.then((result) => {
            this.GetUsers();
        }, (reason) => {

        });
    }

    gridRowClicked(ev, row, column) {
        if (column.prop === "Deactivate") {
            var value = "";
            if (row.IsActive == 1) {
                value = "deactivate";
            } else if (row.IsActive == 2) {
                value = "activate";
            }
            var message = "Are you Sure want to " + value + " the user?";
            var confirmation = confirm(message);
            if (confirmation) {
                this.setIsActive(row);
                this.orderService.UpdateUser(row, 'Active').subscribe(
                    response => {
                        this.GetUsers();
                    },
                    error => console.log(error)
                );
            }
        }
        if(column.prop === "Edit"){
            this.OpenAddNewUser(row);
        }
    }

    setIsActive(row) {
        if (row.IsActive == 1) {
            row.IsActive = 2;
        } else if (row.IsActive == 2) {
            row.IsActive = 1;
        }
    }


    EditTemplate(row) {
        return ' <i id="edit" (click)="column.clickEvent($event,row)" class="fa fa-pencil text-color-blue"></i>';
    }

    DeactivateTemplate(row) {
        if (row.IsActive == 1) {
            return ' <a id="deactive" class="red-underline clickable" (click)="column.clickEvent($event,row)"><i class="fa fa-user-times marginRight"></i>Deactivate</a>';
        } else {
            return ' <a id="active" class="green-underline clickable" (click)="column.clickEvent($event,row)"><i class="fa fa-user marginRight"></i>Activate</a>';
        }
    }

    StatusTemplate(row){
        if (row.IsActive == 2) {
            return '<div>Deactive</div>';
        }else{
            return '<div>Active</div>';
        }
    }
}
