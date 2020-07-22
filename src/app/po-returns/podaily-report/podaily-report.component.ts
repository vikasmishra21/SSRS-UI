import { Component, OnInit } from '@angular/core';
import { PoReturnsService } from "../../_services/po-returns.service";
import { Router, RouterModule } from '@angular/router';
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";

import * as _ from 'underscore';
import { error } from 'util';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-podaily-report',
  templateUrl: './podaily-report.component.html',
  styleUrls: ['./podaily-report.component.css']
})
export class PodailyReportComponent implements OnInit {
  DateFilter = { day: 0, month: 0, year: 0 };

  gridData = {
    data: [],
    columnconfig: [
      { prop: 'type', as: 'Type', cellTemplate: DataTableTemplates.Currency },
      { prop: 'expectednoporeturns', as: 'Expected # of Returns'},
      { prop: 'actualnoporeturns', as: 'Actual # of Returns'},
      { prop: 'expectedtotalcash', as: 'Expected Total Cash'},
      { prop: 'actualtotalcash', as: 'Actual Total Cash' }
    ],
    events: {
      // rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false, csvDownload: true
    }
  };
  gridDataReturns = {
    data: [],
    columnconfig: [
      // { prop: 'NoOfItems', as: 'No. Of Items' },
      { prop: 'OrderId', as: 'Order No.' },
      { prop: 'Password', as: 'Password' },
      { prop: 'PartitionKey', as: 'PostMark Date' },
      { prop: 'PoProblemNotes', as: 'Description Of Problem' }
    ],
    events: {
      // rowClicked: this.gridRowClicked.bind(this)
    },
    settings: {
      search: false, csvDownload: true
    }
  };
  constructor(private poReturnsService: PoReturnsService) { }

  ngOnInit() {
    let date = new Date();
    this.DateFilter.day = date.getDate();
    this.DateFilter.month = date.getMonth() + 1;
    this.DateFilter.year = date.getFullYear();

    this.BindGrids();

  }
  BindGrids(event?) {
    if (event)
      this.DateFilter = event;
    this.GetDailyReportData();
  }

  DownloadPDF() {
    var poDailyReportSummary = {
      DailyPoReturns: this.gridData.data,
      DailyProblems: this.gridDataReturns.data,
      DateFilter: this.DateFilter.month + '-' + this.DateFilter.day + '-' + this.DateFilter.year
    }
    this.poReturnsService.DownloadPdf(poDailyReportSummary).subscribe(page => {
      let datekey = this.DateFilter.month + '-' + this.DateFilter.day + '-' + this.DateFilter.year;
      FileSaver.saveAs(page, datekey + "-Report.pdf")
    }, error => {

    })
  }
  GetDailyReportData() {
    let partitionKey = this.DateFilter.month + '-' + this.DateFilter.day + '-' + this.DateFilter.year;
    //let partitionKey = this.DateFilter.year + '-' + this.DateFilter.month + '-' + this.DateFilter.day;

    let dateLocal = new Date();
    dateLocal.setFullYear(this.DateFilter.year, this.DateFilter.month - 1, this.DateFilter.day);
    let month = (dateLocal.getMonth() + 1) >= 10 ? (dateLocal.getMonth() + 1) : "0" + (dateLocal.getMonth() + 1);
    let Day = dateLocal.getUTCDate() >= 10 ? dateLocal.getUTCDate() : "0" + dateLocal.getUTCDate();

    partitionKey = month + '-' + Day+ '-' + dateLocal.getUTCFullYear();

    this.poReturnsService.GetDailyReport(partitionKey).subscribe(
      response => { this.PopulateDailyReportGrid(response); console.log(response) },
      error => console.log(error)
    );
  }

  private PopulateDailyReportGrid(response) {
    this.gridData.data = [];
    this.gridDataReturns.data = [];

    response[0].forEach(row => {

      // if (row.IsPoProblem) {
      //   this.gridDataReturns.data.push(row);
      // }
      // else {
      if (row.ReminderMailer2ScannedBy != null) {
        let searchObject = _.findWhere(this.gridData.data, { type: row.ReminderMailer2ReturnValue })

        if (!searchObject) {
          searchObject = { type: row.ReminderMailer2ReturnValue, expectednoporeturns: 0,actualnoporeturns:0 };

          this.gridData.data.push(searchObject);
        }

        searchObject.expectednoporeturns = searchObject.expectednoporeturns + 1;
        searchObject.actualnoporeturns = searchObject.actualnoporeturns + 1;
        
        searchObject.expectedtotalcash = searchObject.type * searchObject.expectednoporeturns;
        searchObject.actualtotalcash = searchObject.type * searchObject.actualnoporeturns;
      }
      else if (row.ReminderMailer1ScannedBy != null) {
        let searchObject = _.findWhere(this.gridData.data, { type: row.ReminderMailer1ReturnValue })

        if (!searchObject) {
          searchObject = { type: row.ReminderMailer1ReturnValue, expectednoporeturns: 0,actualnoporeturns:0 };

          this.gridData.data.push(searchObject);
        }

        searchObject.expectednoporeturns = searchObject.expectednoporeturns + 1;
        searchObject.expectedtotalcash = searchObject.type * searchObject.expectednoporeturns;

        searchObject.actualnoporeturns = searchObject.actualnoporeturns + 1;
        searchObject.actualtotalcash = searchObject.type * searchObject.actualnoporeturns;
      }
      else {
        let searchObject = _.findWhere(this.gridData.data, { type: row.InitialMailerReturnValue })

        if (!searchObject) {
          searchObject = { type: row.InitialMailerReturnValue, expectednoporeturns: 0,actualnoporeturns:0 };

          this.gridData.data.push(searchObject);
        }

        searchObject.expectednoporeturns = searchObject.expectednoporeturns + 1;
        searchObject.expectedtotalcash = searchObject.type * searchObject.expectednoporeturns;

        searchObject.actualnoporeturns = searchObject.actualnoporeturns + 1;
        searchObject.actualtotalcash = searchObject.type * searchObject.actualnoporeturns;
      }
      // }
    });

    response[1].forEach(row => {

        let searchActualMoneyObject = _.findWhere(this.gridData.data, { type: row.PoProblemActualMoney })

        if (!searchActualMoneyObject) {
          searchActualMoneyObject = { type: row.PoProblemActualMoney, expectednoporeturns: 0,actualnoporeturns:0 };

          this.gridData.data.push(searchActualMoneyObject);
        }
        searchActualMoneyObject.actualnoporeturns = searchActualMoneyObject.actualnoporeturns + 1;
        searchActualMoneyObject.actualtotalcash = searchActualMoneyObject.type * searchActualMoneyObject.actualnoporeturns; 

        let searchExpectedMoneyObject = _.findWhere(this.gridData.data, { type: row.PoProblemExpectedMoney })

        searchExpectedMoneyObject.actualnoporeturns = searchExpectedMoneyObject.actualnoporeturns - 1;
        searchExpectedMoneyObject.actualtotalcash = searchExpectedMoneyObject.type * searchExpectedMoneyObject.actualnoporeturns;
        
        searchActualMoneyObject.expectedtotalcash = searchActualMoneyObject.type * searchActualMoneyObject.expectednoporeturns;      
    });

  //   response[1].forEach(row => {

  //     let searchExpectedMoneyObject = _.findWhere(this.gridData.data, { type: row.PoProblemExpectedMoney })

  //     searchExpectedMoneyObject.actualnoporeturns = searchExpectedMoneyObject.actualnoporeturns - 1;
  //     //searchExpectedMoneyObject.actualtotalcash = searchExpectedMoneyObject.type * searchExpectedMoneyObject.actualtotalcash;      
  // });

    this.gridDataReturns.data = response[1];

  }
  private FormattDates(input: number) {
    if (input > 9) return input; else return "0" + input;
  }
}