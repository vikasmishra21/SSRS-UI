import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { Chart, Order } from "../../_models/models";
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";

@Component({
  selector: 'app-order-scorecarding',
  templateUrl: './order-scorecarding.component.html',
  styleUrls: ['./order-scorecarding.component.css']
})
export class OrderScorecardingComponent implements OnInit {
  orderCode: string;
  orderType: string;
  chart: Chart;
  totalScorded: number =0;
  totaltodo:number=0;
  InfoSummary = { ContactInfo: 0, DemoGraphics: 0, Others: 0 };
  gridData = {
    data: [],
    columnconfig: [
      {prop: 'ID', as: 'ID'},
      { prop: 'Date', as: 'Date', cellTemplate: DataTableTemplates.DateLocal },
      { prop: 'abc', as: 'Status', cellTemplate: DataTableTemplates.Custom, template: this.statusTemplate.bind(this) },
      { prop: 'run', as: 'Run', cellTemplate: DataTableTemplates.Run, clickEvent: this.runClicked.bind(this) },
      { prop: 'records', as: 'Records' },
    ],
    events: {
      // rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false
    }
  };
  constructor(private router: Router, private orderService: OrdersService) { }

  statusTemplate(row) {
    if (row.status == 1)
      return '<span class="red-cell"></span>'
    else if (row.status == 2)
      return '<span class="yellow-cell"></span>'
    else if (row.status == 3)
      return '<span class="green-cell"></span>'
  }

  runClicked(event, row) {
    //let UtcDate=new Date(row["Date"]).toUTCString();
    let date = row["Date"];
    this.orderService.SetScoreCardingID(row['ID'].toString(), date);
    this.router.navigate(['/orders/scorecardingqaresponse']);
    console.log(event, row);
  }

  ngOnInit() {
    this.orderCode = this.orderService.GetOrderCode();
    this.orderType = this.orderService.GetOrderType();
    if (!this.orderCode || !this.orderType) {
      this.router.navigate(['/orders/overview']);
    } else
      this.Bind();
  }

  Bind() {
    this.BindSummaryTable();
    this.BindChart();
    this.BindInfo();
  }

  BindSummaryTable() {
    this.orderService.GetScoreCardSummary(this.orderCode).subscribe(
      response => {
        response.forEach(row => {
          //set status
          if (!row.ToDoCount) {
            row.status = 1;
            row.records = "0";
          }
          else if (row.CompletedCount < row.ToDoCount) {
            row.status = 2;
            if (row.CompletedCount == null)
              row.CompletedCount = 0;
            row.records = row.CompletedCount + " Of " + row.ToDoCount;
          }
          else if (row.CompletedCount == row.ToDoCount) {
            row.status = 3;
            row.records = row.CompletedCount + " Of " + row.ToDoCount;
          }
            this.totalScorded +=row.CompletedCount;
            this.totaltodo +=row.ToDoCount;
        });
        this.gridData.data = response;
        console.log(response);
      },
      error => { console.log(error); });
  }

  BindChart() {

    this.chart = undefined;
    this.orderService.GetScoreCardSummayInfoTrend(this.orderCode, this.orderType).subscribe(
      response => {
        let config = {
          id: 'gaugeChartResponses',
          data: {
            "type": "line",
            "scale-x": {
              "label": {
                "text": "Dates",
              },
              /* Add your scale labels with a labels array. */
              "labels": []
            }, "legend": {
              "background-color": "#FFF",
              "margin": "auto auto 10 auto",
              "adjust-layout": true,
              "layout": "float",
              "marker": {
                "type": "match",
                "showLine": true
              },
              "shadow": false,
              "border-radius": 3
            },
            "series": [{ "values": [], "text": "Contact Info" }, { "text": "Demographics", "values": [] }, { "text": "Others", "values": [] }]
          }
        }

        response.forEach(element => {
          config.data["scale-x"]["labels"].push(element.Column1);
          config.data["series"][0].values.push(element.ContactInfo);
          config.data["series"][1].values.push(element.DemoGraphics);
          config.data["series"][2].values.push(element.Others);
        });

        this.chart = new Chart(config);
      }, error => {
        console.log(error);
      });

  }
  BindInfo() {
    this.orderService.GetScoreCardSummayInfo(this.orderCode, this.orderType).subscribe(
      response => {
        if (response.length == 1)
          this.InfoSummary = response[0];
      }, error => {
        console.log(error);
      });
  }
}
