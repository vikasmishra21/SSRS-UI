import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { Order } from "../../_models/models";
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import { debug } from 'util';
@Component({
  selector: 'app-scorecarding-qa-responses',
  templateUrl: './scorecarding-qa-responses.component.html',
  styleUrls: ['./scorecarding-qa-responses.component.css']
})
export class ScorecardingQaResponsesComponent implements OnInit {
  orderCode: string;
  orderType: string;
  scoreCardingID: string;
  scoreCardingDate: string;
  PullPercent: string;
  ShowPullPercentInput = false;
  Summary = { Total: 0, Completed: 0, Incompleted: 0 }
  gridData = {
    data: [],
    columnconfig: [
      { prop: 'launch', as: 'Launch', cellClasses: 'anchor-text', cellTemplate: DataTableTemplates.Custom, template: (row) => { return "Launch"; } },
      { prop: 'STATUS', as: 'Status', cellTemplate: DataTableTemplates.Custom, template: (row) => { return row.Status == 1 ? '<span class="alert-danger p-1 d-flex">Incomplete</span>' : '<span class="alert-success p-1 d-flex">Completed</span>'; } }
    ],
    events: {
      rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false,
      srNo: true
    }
  };
  constructor(private router: Router, private orderService: OrdersService) { }


  ngOnInit() {
    this.orderCode = this.orderService.GetOrderCode();
    this.orderType = this.orderService.GetOrderType();
    this.scoreCardingID = this.orderService.GetScoreCardingID();
    this.scoreCardingDate = JSON.stringify(this.orderService.GetScoreCardingDate());

    if (!this.orderCode || !this.orderType) {
      this.router.navigate(['/orders/overview']);
    } else if (!this.scoreCardingID || !this.scoreCardingDate)
      this.router.navigate(['/orders/scorecarding']);
    else
      this.Bind();
  }

  gridRowClicked(ev, row, column) {
  
    let url = '/#/qa/' + this.orderCode + '/' + this.orderType + '/' + row.SummaryID + '/' + row.SampleID
    let openedWindow = window.open(url, "Ratting", "width=" + screen.width + ",height=" + screen.height + ",0,status=0,");
    openedWindow.focus();
    let vm = this;
    var timer = setInterval(function () {
      if (openedWindow.closed) {
        clearInterval(timer);
        vm.Bind();
      }
    }, 1000);
  }

  Bind() {
    this.BindGrid();
    this.BindSummary();
  }
  BindGrid() {
    this.gridData.data = [];
    this.orderService.GetQARecords(this.orderCode, this.scoreCardingID, this.scoreCardingDate).subscribe(
      response => {
        this.gridData.data = response;
        this.ShowPullPercentInput = (this.gridData.data.length == 0);
        // console.log(response);
        this.BindSummary();
      }, error => {
        console.log(error);
      });
  }

  BindSummary() {
    this.Summary.Total = this.gridData.data.length;
    this.Summary.Completed = 0;
    this.Summary.Incompleted = 0;
    this.gridData.data.forEach(row => {
      if (row.Status == 2)
        this.Summary.Completed++;
      else
        this.Summary.Incompleted++;
    });

  }

  Pull() {
    this.orderService.PullRecordsForScoreCarding(this.orderCode, this.scoreCardingID, this.PullPercent, this.scoreCardingDate).subscribe(
      response => {
        this.Bind();
        console.log(response);
      }, error => {
        console.log(error);
      });
  }
}
