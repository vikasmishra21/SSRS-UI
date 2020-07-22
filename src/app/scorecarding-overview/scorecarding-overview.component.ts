import { Component, OnInit } from '@angular/core';
import { DataTableTemplates } from "../_enums/data-table-templates.enum";
import { OrdersService } from "../_services/orders.service";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-scorecarding-overview',
  templateUrl: './scorecarding-overview.component.html',
  styleUrls: ['./scorecarding-overview.component.css']
})
export class ScorecardingOverviewComponent implements OnInit {

  gridData = {
    data: [],
    columnconfig: [
      { prop: 'OrderCode', as: 'ORDER CODE', cellClasses: 'anchor-text' },
      { prop: 'OrderType', as: 'ORDER TYPE', cellTemplate: DataTableTemplates.OrderType }
    ],
    events: {
      rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false
    }
  };

  constructor(private router: Router, private orderService: OrdersService) { }

  ngOnInit() {
    this.orderService.GetAcrossOrdersScoreCarding().subscribe(response => { this.gridData.data = response; }, error => { console.log(error) });
  }
  gridRowClicked(ev, row, column) {
    this.orderService.SetOrderCode(row["OrderCode"], row["OrderType"].toString());
    this.router.navigate(['/orders/scorecarding']);
  }

}
