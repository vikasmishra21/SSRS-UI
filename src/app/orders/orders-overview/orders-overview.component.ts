import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SqlFilterQueryBuilderComponent } from '../../common/sql-filter-query-builder/sql-filter-query-builder.component';
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../_services/authentication.service';
import { ChangePasswordComponent } from '../../change-password/change-password.component';

@Component({
  selector: 'app-orders-overview',
  templateUrl: './orders-overview.component.html',
  styleUrls: ['./orders-overview.component.css']
})
export class OrdersOverviewComponent implements OnInit {
  filterString = '';
  getbool: Subscription;
  passwordchange:boolean=false;
  gridData = {
    data: [],
    columnconfig: [
      { prop: 'OrderCode', as: 'ORDER CODE', cellClasses: 'anchor-text' },
      { prop: 'OSCTemplateName', as: 'OSC TEMPLATE NAME' },
      { prop: 'OrderType', as: 'ORDER TYPE', cellTemplate: DataTableTemplates.OrderType },
      { prop: 'SampleCount', as: 'SAMPLE COUNT' },
      { prop: 'ReceiptedCount', as: 'RECEIPTED COUNT' },
      { prop: 'FinalizedCount', as: 'FINALIZED COUNT' },
      { prop: 'HardCloseDate', as: 'HARD CLOSE DATE', cellTemplate: DataTableTemplates.DateLocal },
      { prop: 'CreatedOn', as: 'CREATED ON', cellTemplate: DataTableTemplates.DateLocal },
      { prop: 'CreatedBy', as: 'CREATED BY' }
    ],
    events: {
      rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: true
    }
  };

  group = {
    rules: [{ "operator": "&&", "rules": [] }]
  }


  constructor(private router: Router, private orderService: OrdersService,
    private modalService: NgbModal,private authenticationService: AuthenticationService) {
      
       
        
    this.orderService.newOrderAdded.subscribe(res => {
      this.bindGrid();
    });
  }

  ngOnInit() {
    this.bindGrid();
   var isPasswordExpired = JSON.parse(localStorage.getItem("isPasswordExpired"));
   var PasswordExpiryRemaining_Days = JSON.parse(localStorage.getItem("PasswordExpiryRemaining_Days"));
    if(isPasswordExpired==true){
        this.ChangePassword(PasswordExpiryRemaining_Days);
    }

  }
 ChangePassword(PasswordExpiryRemaining_Days) {
   var options:NgbModalOptions={ };
   options["size"]="sm";
   if(Math.sign(Number(PasswordExpiryRemaining_Days))<=0)
   {
    options["backdrop"] = "static";
    options["keyboard"] = false;
   }

      const modalRef = this.modalService.open(ChangePasswordComponent, options);
          //modalRef.componentInstance.responseOrder = this.Order;
      modalRef.result.then((result) => {
          this.LogOut();
          }, (reason) => {

          });
      
  }
  LogOut() {
    localStorage.removeItem("isPasswordExpired");
    localStorage.removeItem("PasswordExpiryRemaining_Days");
  this.router.navigate(['/login']);
}
  bindGrid() {
    this.orderService.GetOrders(this.filterString).subscribe(
      response => this.populateGrid(response),
      error => console.log(error)
    )
  }
  resetGrid() {
    this.gridData.data = [];
  }

  populateGrid(response: any[]) {
    //reset all variables of GridObject
    this.resetGrid();
    if (response.length > 0) {
      this.gridData.data = response;
    }
  }

  gridRowClicked(ev, row, column) {
    if (column.prop == "OrderCode") {
      this.orderService.SetOrderCode(row[column.prop], row["OrderType"].toString());
      this.router.navigate(['/orders/orderdetails']);
    }
  }


  ShowFilterPopup(event) {
    const modalRef = this.modalService.open(SqlFilterQueryBuilderComponent);
    modalRef.componentInstance.fields = [{ name: 'ORDER CODE', column: 'OrderCode', type: 'string' },
    { name: 'OSC TEMPLATE NAME', column: 'OSCTemplateName', type: 'string' },
    { name: 'ORDER TYPE', column: 'OrderType', type: 'singlechoice', options: [{ code: 1, name: 'Diary' }, { code: 2, name: 'PPM' }, { code: 3, name: 'PR' }] },
    { name: 'ORDER Status', column: 'IsActive', type: 'singlechoice', options: [{ code: 1, name: 'Active' }, { code: 2, name: 'Closed' }] },
    { name: 'CREATED On', column: 'CreatedOn', type: 'date' },
    { name: 'SAMPLE COUNT', column: 'SampleCount', type: 'number' }];
    modalRef.componentInstance.group = this.group;

    modalRef.result.then((result) => {
      this.group = result.group;
      this.filterString = JSON.parse(result.condition);
      this.bindGrid();
    });
  }
}
