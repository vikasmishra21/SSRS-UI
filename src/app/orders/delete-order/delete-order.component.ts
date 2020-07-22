import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-delete-order',
  templateUrl: './delete-order.component.html',
  styleUrls: ['./delete-order.component.css']
})
export class DeleteOrderComponent implements OnInit {
  orderCode: string;
  enteredOrder: string;
  constructor(private orderService: OrdersService, private router: Router) { }

  ngOnInit() {
    this.orderCode = this.orderService.GetOrderCode();
    if (!this.orderCode) {
      this.router.navigate(['/orders/overview']);
    }
  }

  Delete() {
    if (this.orderCode == this.enteredOrder) {
      this.orderService.DeleteOrder(this.orderCode).subscribe(response => {
        this.router.navigate(['/orders/overview']);
      }, error => {
        console.log(error);
      })
    } else
      alert('Order Code mismatch.');
  }

}
