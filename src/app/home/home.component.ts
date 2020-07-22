import { Component, OnInit } from '@angular/core';
import { HomeService } from "../_services/home.service";
import { OrdersService } from "../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  Orders: any[];
  Activities: any[];
  activityType: string;

  constructor(private homeService: HomeService,
    private orderService: OrdersService, private router: Router) { }

  ngOnInit() {
    this.GetOrders();
    this.activityType = "";
    this.GetActivites(this.activityType);
  }

  GetOrders() {
    this.Orders = [];
    this.homeService.GetOrders().subscribe(
      response => { this.Orders = this.AddCharts(response); },
      error => {
        console.log(error);
      });
  }

  AddCharts(orders) {
    console.log(orders);

    orders.forEach(order => {
      order.chartConfig = this.GetChartConfig(order.FinalizedCount, order.ReceiptedCount, order.OrderCode);
    });

    return orders;
  }

  GetChartConfig(finalizeCount, receiptedCount, ordercode) {
    finalizeCount = (!finalizeCount || isNaN(finalizeCount)) ? 0 : finalizeCount;
    receiptedCount = (!receiptedCount || isNaN(receiptedCount)) ? 0 : receiptedCount;
    return {
      id: 'stackchart-' + ordercode,
      height: '100px',
      width: '50px',
      data: {
        "type": "bar",
        "plot": {
          "stacked": true
        }, "plotarea": {
          "x": 0, "y": 0,
          "margin": "0px 0px 0px 0px"
        },
        "backgroundColor": "#fff",
        "scaleX": {
          "visible": false
        },
        "scaleY": {
          "visible": false
        },
        "tooltip": {
          "htmlMode": true,
          "backgroundColor": "none",
          "padding": 0,
          "placement": "node:center",
          "text": "<div class='zingchart-tooltip'><div class='scaley-value'>%v</div></div>"
        },
        "series": [
          {
            "values": [
              finalizeCount
            ],
            "alpha": 1,
            "background-color": "#4184f3",
            "hover-state": {
              backgroundColor: '#2956A0'
            }
          },
          {
            "values": [
              receiptedCount
            ],
            "alpha": 1,
            "background-color": "#db4437",
            "hover-state": {
              backgroundColor: '#901E15'
            }
          }
        ]
      }
    };

  }

  GetActivites(type) {
    this.activityType = type;
    this.homeService.GetLatestActivites(this.activityType).subscribe(
      response => { this.CreateActivites(response); console.log(response); },
      error => {
        console.log(error);
      });
  }

  CreateActivites(response) {
    this.Activities = [];
    response.forEach(activity => {
      let activityText = '';

      let name = activity.ModifiedBy;
      if (!name)
        name = activity.CreatedBy;

      switch (activity.ActivityType) {
        case 1:
          activityText = '<strong>' + name + '</strong> Generated ' + activity.RecordsGenerated +
            ' Samples For Order Id: <strong>' + activity.OrderCode + '</strong> For Initial Mailer  on <strong>' + this.getFormatedDate(activity.ModifiedOn) + '</strong>';
          break;
        case 2:
          activityText = '<strong>' + name + '</strong> Generated ' + activity.RecordsGenerated +
            ' Samples For Order Id: <strong>' + activity.OrderCode + '</strong> For Remainder One Mailer  on <strong>' + this.getFormatedDate(activity.ModifiedOn) + '</strong>';
          break;
        case 3:
          activityText = '<strong>' + name + '</strong> Generated ' + activity.RecordsGenerated +
            ' Samples For Order Id: <strong>' + activity.OrderCode + '</strong> For Remainder Two Mailer  on <strong>' + this.getFormatedDate(activity.ModifiedOn) + '</strong>';
          break;
        case 4:
          activityText = '<strong>' + name + '</strong> Pulled ' + activity.RecordsGenerated +
            ' Samples For Order Id: <strong>' + activity.OrderCode + '</strong> on <strong>' + this.getFormatedDate(activity.ModifiedOn) + '</strong>';
          break;
      }

      let activityConfig = {
        type: activity.ActivityType,
        text: activityText
      }
      this.Activities.push(activityConfig);
    });
  }

  GoToOrderDetails(orderCode, orderType) {
    this.orderService.SetOrderCode(orderCode, orderType.toString());
    this.router.navigate(['/orders/orderdetails']);
  }

  getFormatedDate(modifiedDate)
  {
    let newDate = new Date(modifiedDate);
    let month = newDate.toLocaleString('default', { month: 'long' });
    let date = newDate.getDate();
    let year = newDate.getFullYear();
    return date + '-'+month+'-'+year+' '+modifiedDate.split('T')[1];

  }

}
