import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import * as blobUtil from 'blob-util';
@Component({
  selector: 'app-image-viewer',
  templateUrl: './image-viewer.component.html',
  styleUrls: ['./image-viewer.component.css']
})
export class ImageViewerComponent implements OnInit {

  @Input()
  imageUrls;

  @Input()
  Sample;

  orderCode: string;

  imageview;
  imgsrc;
  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer, private router: Router, private ordersService: OrdersService) { }

  ngOnInit() {
    this.imageview = '1';
    this.orderCode = this.ordersService.GetOrderCode();
    if (!this.orderCode) {
      this.router.navigate(['/orders/overview']);
    } else
      this.GetImageUrl();
  }

  GetImageUrl() {
    this.ordersService.GetImageUrl(this.orderCode, this.Sample["s_password"], this.imageview)
      .subscribe(response => {
        this.imgsrc = this.sanitizer.bypassSecurityTrustUrl(response);
      }, error => {

      });
  }


}
