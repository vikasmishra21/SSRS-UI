import { Component, OnInit } from "@angular/core";
import { OrdersService } from "../../_services/orders.service";
import { Order } from "../../_models/models";
import { Router } from "@angular/router";
// import { NotificationsService } from 'angular2-notifications-lite';

@Component({
    selector: 'app-closeorder',
    templateUrl: './closeorder.component.html',
    styleUrls: ['./closeorder.component.css']
})
export class CloseorderComponent implements OnInit {
    constructor(private orderService: OrdersService, private router: Router,
        ) { }
    showWarning: boolean = true;
    showCount: boolean = true;
    orderCode: string = '';
    orderDetails = new Order('');
    NotPulledFinalized: number = 0;
    ngOnInit() {
        //get order 
        this.orderCode = this.orderService.GetOrderCode();
        if (!this.orderCode) {
            this.router.navigate(['/orders/overview']);
        } else
            this.getOrder();
    }

    setShowWarning() {
        this.showWarning = !this.showWarning;
    }

    setShowCount() {
        this.showCount = !this.showCount;
    }
    CloseOrder() {
        this.orderDetails.IsActive = 2;
        this.orderService.UpdateOrder(this.orderDetails).subscribe(
            response => {
                // this.notificationsService.success('Order Closed', 'Order closed succesfully.');
                console.log("Order closed");
                this.router.navigate(['/orders/overview']);
            },
            error => { console.log(error) }
        )
    }
    getOrder() {
        this.orderService.GetOrder(this.orderCode).subscribe(
            response => {
                this.orderDetails = response;
                this.NotPulledFinalized = this.orderDetails.SampleCount - this.orderDetails.PulledCount;
            },
            error => { console.log(error) }
        )
    }

}
