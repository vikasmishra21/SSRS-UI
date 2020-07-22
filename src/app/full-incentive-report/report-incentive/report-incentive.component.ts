import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";

import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-report-incentive',
  templateUrl: './report-incentive.component.html',
  styleUrls: ['./report-incentive.component.css']
})
export class ReportIncentiveComponent implements OnInit {
    output: {
        Data: any,
        Filename: string,
        TotalIncentiveDisbursed : string
    }

    gridData = {
        data: [],
        columnconfig: [
        ],
        events: {
            // rowClicked: this.gridRowClicked.bind(this)
        },
        settings: {
            search: false,
        }
    };
    constructor(private orderService: OrdersService) { }

  ngOnInit() {
      this.GetOverallIncentiveDisbursement();
  }

  GetOverallIncentiveDisbursement() {
      this.orderService.GetOverallIncentiveDisbursement().subscribe(
          response => { this.output = response; this.bindGrid(this.output.Data); },
          error => { console.log(error);}
      );
  }

  Generate(IsTest) {
      //is test is true den just download the file directly
      //else save file and update activity
      let user = JSON.parse(localStorage.getItem('currentUser'));
      this.orderService.Generate(IsTest,user['username'], this.output).subscribe(
          response => {
            //   let fileName = response;
            //   if (IsTest) {
            //     //   this.orderService.DownloadMailer("1", fileName).subscribe(
                      
            //     //       response => { FileSaver.saveAs(response, "PromisedIncetiveDisbursement.txt");},
            //     //       error => console.log(error)
            //     //   );
            //     alert("Request submitted successfully");
            //   }
            //   else
            //       this.GetOverallIncentiveDisbursement();
            alert("Request submitted successfully");
          },
          error => {console.log(error)}
      );
  }

  bindGrid(response) {
      this.gridData.data = [];
      this.gridData.columnconfig = [];

      if (response.length > 0) {
          let columns = Object.keys(response[0]);
          for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
              let column = {};
              column['prop'] = columns[columnIndex];
              column['as'] = columns[columnIndex];
              this.gridData.columnconfig.push(column);
          }
          this.gridData.data = response;
      }
  }
}
