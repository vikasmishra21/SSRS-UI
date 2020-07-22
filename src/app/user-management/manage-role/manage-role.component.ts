import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "../../_services/orders.service";
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import * as _ from 'underscore';


@Component({
    selector: 'app-manage-role',
    templateUrl: './manage-role.component.html',
    styleUrls: ['./manage-role.component.css']
})
export class ManageRoleComponent implements OnInit {
    @Input()
    UserRoleData: any;
    gridData = {
        data: [],
        columnconfig: [
            { prop: 'Edit', as: 'Edit', cellTemplate: DataTableTemplates.Custom, template: this.EditTemplate.bind(this) },
            { prop: 'delete', as: 'Delete', cellTemplate: DataTableTemplates.Delete },
            { prop: 'Name', as: 'Role' },
            //  { prop: 'IsActive', as: 'Status' }
        ],
        events: {
            rowClicked: this.gridRowClicked.bind(this)
        },
        settings: {
            search: false,
        }
    };
    constructor(private orderService: OrdersService, public activeModal: NgbActiveModal) { }
    Permissions: any[] = [];
    MainMenu: any[] = [];
    IsNewRole: boolean;
    IsUpdateRole: boolean;
    Role = {};
    Checked = {};

    errorText = "";
    ngOnInit() {
        this.GetRoles();
        this.setChecked();
        this.setRoleClass();
    }

    setRoleClass() {
        this.Role = {
            RoleID: -1,
            Name: "",
            PermissionID: ""
        }
    }

    setChecked() {
        this.Checked = {
            '1': false,
            '2': false,
            '3': false,
            '4': false,
            '5': false,
            '6': false,
            '101': false,
            '102': false,
            '103': false,
            '201': false,
            '202': false,
            '203': false,
            '204': false,
            '205': false,
            '206': false,
            '207': false,
            '208': false,
            '209': false,
            '301': false,
            '302': false,
            '303': false,
            '401': false,
            '402': false,
            '601': false,
            '602': false,
        }
    }

    SetPermissionID(value) {
        let firstChar = value.charAt(0);
        switch (firstChar) {
            case '1':
                this.checkOrders();
                break;
            case '2':
                this.checkOrder();
                break;
            case '3':
                this.checkPOReturns();
                break;
            case '4':
                this.checkIncentive();
                break;
            case '5':
                // this.setOrders(true);
                break;
            case '6':
                this.checkUserManagement();
                break;
        }



        //let index = this.Permissions.indexOf(value);
        //if (this.Permissions.indexOf(value) == -1)
        //    this.Permissions.push(value);
        //else
        //    this.Permissions.splice(index, 1);
        //this.SetMainMenuCheck();
    }

    SetMainMenuPermissionID(value) {
        switch (value) {
            case '1':
                this.setOrders(this.Checked[value]);
                break;
            case '2':
                this.setOrder(this.Checked[value]);
                break;
            case '3':
                this.setPOReturns(this.Checked[value]);
                break;
            case '4':
                this.setIncentive(this.Checked[value]);
                break;
            case '5':
                // this.setOrders(true);
                break;
            case '6':
                this.setUserManagement(this.Checked[value]);
                break;
        }
    }

    setOrders(flag) {
        this.Checked['101'] = flag;
        this.Checked['102'] = flag;
        this.Checked['103'] = flag;
    }
    setOrder(flag) {
        this.Checked['201'] = flag;
        this.Checked['202'] = flag;
        this.Checked['203'] = flag;
        this.Checked['204'] = flag;
        this.Checked['205'] = flag;
        this.Checked['206'] = flag;
        this.Checked['207'] = flag;
        this.Checked['208'] = flag;
        this.Checked['209'] = flag;
    }
    setPOReturns(flag) {
        this.Checked['301'] = flag;
        this.Checked['302'] = flag;
        this.Checked['303'] = flag;
    }
    setIncentive(flag) {
        this.Checked['401'] = flag;
        this.Checked['402'] = flag;

    }
    setUserManagement(flag) {
        this.Checked['601'] = flag;
        this.Checked['602'] = flag;
    }

    checkOrders() {
        if (this.Checked['101'] || this.Checked['102'] || this.Checked['103'])
            this.Checked['1'] = true;
        else
            this.Checked['1'] = false;
    }

    checkOrder() {
        if (this.Checked['201'] || this.Checked['202'] || this.Checked['203'] || this.Checked['204'] || this.Checked['205'] || this.Checked['206'] || this.Checked['207'] || this.Checked['208'] || this.Checked['209'])
            this.Checked['2'] = true;
        else
            this.Checked['2'] = false;
    }

    checkPOReturns() {
        if (this.Checked['301'] || this.Checked['302'] || this.Checked['303'])
            this.Checked['3'] = true;
        else
            this.Checked['3'] = false;
    }

    checkIncentive() {
        if (this.Checked['401'] || this.Checked['402'])
            this.Checked['4'] = true;
        else
            this.Checked['4'] = false;
    }

    checkUserManagement() {
        if (this.Checked['601'] || this.Checked['602'])
            this.Checked['6'] = true;
        else
            this.Checked['6'] = false;
    }

    checkDuplicate() {
        let flag = false;
        if (!this.IsUpdateRole) {
            for (const key in this.gridData.data) {
                if (this.gridData.data[key].Name.toLowerCase() == this.Role['Name'].toLowerCase()) {
                    flag = true;
                    break;
                }
            }

        }
        return flag;
    }

    SaveRole() {
        this.errorText = "";
        if (this.Role['Name']) {
            if (!this.checkDuplicate()) {
                let keys = Object.keys(this.Checked);
                for (var key in keys) {
                    if (this.Checked[keys[key]])
                        this.Permissions.push(keys[key]);
                }
                if (this.Permissions.length > 0) {
                    this.Role['PermissionID'] = this.Permissions.toString();
                    if (this.IsUpdateRole) {
                        this.orderService.UpdateRole(this.Role).subscribe(
                            response => {
                                // this.activeModal.close();
                                this.IsUpdateRole = false;
                                this.IsNewRole = false;
                            },
                            error => { console.log(error) }
                        )
                    }
                    else {
                        this.orderService.InsertRole(this.Role).subscribe(
                            response => {
                                //this.activeModal.close();
                                this.IsNewRole = false;
                                this.IsUpdateRole = false;
                                this.GetRoles();
                            },
                            error => { console.log(error) }
                        )
                    }
                }
                else {
                    this.errorText = "**Select atleast one permission.";
                }
            } else {
                this.errorText = "**Role Name already exist.";
            }
        }
        else
            this.errorText = "**Role Name is mandatory.";
    }

    GetRoles() {
        this.orderService.GetRoles().subscribe(
            response => {
                this.gridData.data = response;
            },
            error => { console.log(error) }
        )
    }

    OpenAddNewRole() {
        this.IsNewRole = true;
        this.IsUpdateRole = false;
        this.setRoleClass();
        this.setChecked();
    }

    ManageRole() {
        this.IsNewRole = false;
        this.IsUpdateRole = false;
    }

    gridRowClicked(ev, row, column) {
        if (column.prop === "Edit") {
            this.IsUpdateRole = true;
            this.IsNewRole = false;
            this.Role['ID'] = row['ID'];
            this.Role['Name'] = row['Name'];
            let permissionArray = row['PermissionID'].split(',');
            for (var permission of permissionArray) {
                this.Checked[permission] = true;
            }
        }
        else if (column.prop === "delete") {
            const Role = _.where(this.UserRoleData, { 'Name': row.Name });
            if (Role.length > 0) {
                const userNames = _.pluck(Role, 'UserName');
                alert("Assigned role can't be deleted.Role is assigned to users : " + userNames.toString());
            } else {
                var confirmation = confirm("Are you Sure want to delete this row?");
                if (confirmation) {
                    this.deleteRole(row['ID']);
                }
            }
        }
    }

    deleteRole(id: number) {
        this.orderService.DeleteRole(id).subscribe(
            response => this.GetRoles(),
            error => console.log(error)
        )
    }

    EditTemplate(row) {
        return ' <i id="edit" (click)="column.clickEvent($event,row)" class="fa fa-pencil text-color-blue"></i>';
    }
}
