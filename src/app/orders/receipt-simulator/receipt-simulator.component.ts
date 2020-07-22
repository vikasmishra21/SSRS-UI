import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "../../_services/orders.service";

@Component({
  selector: 'app-receipt-simulator',
  templateUrl: './receipt-simulator.component.html',
  styleUrls: ['./receipt-simulator.component.css']
})
export class ReceiptSimulatorComponent implements OnInit {
    receiptCount: number = 0;
    Count: number = 0;
    constructor(public activeModal: NgbActiveModal, private orderService: OrdersService,) { }
    @Input()
    orderCode: string;

    ngOnInit() {

        this.GetCountOfInitialMail();
    }
    GetCountOfInitialMail() {
        this.orderService.GetInitialMailCount(this.orderCode).subscribe(
            response => { this.Count = response;},
            error => console.log(error)
        );
    }

  ok() {
      this.activeModal.close(this.receiptCount);
  }
}
