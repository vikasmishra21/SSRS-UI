import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewOrderComponent } from './add-new-order/add-new-order.component';
import { UploadSampleComponent } from "./upload-sample/upload-sample.component";
import { Router, RouterModule } from '@angular/router';
import { OrdersService } from "../_services/orders.service";
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
 getbool: Subscription;
 passwordchange:boolean;
  constructor(private modalService: NgbModal,
    private router: Router, private orderService: OrdersService,private authenticationService: AuthenticationService) { 
this.getbool= this.authenticationService.getboolval().subscribe(data=>{
this.passwordchange=data;
})
    }

  OrdersOverViewPaths: string[] = ['/orders/incentives', '/orders/cleaning', '/orders/overview'];
private checkbool: Subject<boolean>= new Subject<boolean>();
  ngOnInit() {
  }

  OpenAddNewOrderModal() {
      const modalRef = this.modalService.open(AddNewOrderComponent);
      modalRef.componentInstance.responseOrder = null;
      modalRef.result.then((result) => {
      this.orderService.newOrderAdded.emit('new Order Added'); 
    }, (reason) => {
      this.orderService.newOrderAdded.emit('closed');
    });

  }

  OpenUploadSampleModal() {
      const modalRef = this.modalService.open(UploadSampleComponent, { size: "sm" }).result.then((result) => {
      console.log(result);
    }, (reason) => {
      console.log(reason);
    });
  }

  ShowOverviewRibbon() {
    return this.OrdersOverViewPaths.indexOf(this.router.url) > -1;
  }
}