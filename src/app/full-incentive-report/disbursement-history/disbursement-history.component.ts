import { Component, OnInit } from '@angular/core';
import { Chart } from "../../_models/models";
import { OrdersService } from "../../_services/orders.service";
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";

import * as FileSaver from 'file-saver';
import { LoaderSeviceService } from '../../_services/loader-sevice.service';
import { Router } from '@angular/router';
const today = new Date();
@Component({
    selector: 'app-disbursement-history',
    templateUrl: './disbursement-history.component.html',
    styleUrls: ['./disbursement-history.component.css']
})
export class DisbursementHistoryComponent implements OnInit {
    gridBindingData: any;
    DateFilterTo: NgbDateStruct;
    DateFilterFrom: NgbDateStruct;
    scheduledDate: NgbDateStruct;
    scheduledTime: any;
    scheduleReminderoption: boolean = false;
    scheduleDateFlag: boolean = false;
    scheduleTimeFlag: boolean = false;
    isTest: boolean;
    chart: Chart;
    gridData = {
        data: [],
        columnconfig: [

            { prop: 'CreatedOn', as: 'Disbursed On', cellTemplate: 9 },
            { prop: 'CreatedBy', as: 'Disbursed By' },
            { prop: 'RecordsGenerated', as: 'Total Sum Disbursed' },
            { prop: 'IsTest', as: 'Is Test File', cellTemplate: DataTableTemplates.Custom, template: this.isTestTemplate.bind(this) },
            { prop: 'Status', as: 'File Status', cellTemplate: DataTableTemplates.WebJobStatus },
            { prop: 'ViewDetails', as: 'View Details', cellClasses: 'anchor-text', cellTemplate: DataTableTemplates.Custom, template: this.viewDetailsTemplate.bind(this)  },
            { prop: 'Download', as: 'Download', cellClasses: 'anchor-text', cellTemplate: DataTableTemplates.Custom, template: this.downloadTemplate.bind(this) },

        ],
        events: {
            rowClicked: this.gridRowClicked.bind(this)
        },
        settings: {
            search: false,
        }
    };
    gridData2 = {
      data: [],
      columnconfig: [
          { prop: 'MetaData', as: 'Scheduled Date', cellTemplate: DataTableTemplates.Custom, template: this.resultTemplate.bind(this) },
          { prop: 'CreatedBy', as: 'Scheduled By' },
          { prop: 'IsTest', as: 'Is Test File', cellTemplate: DataTableTemplates.Custom, template: this.isTestTemplate.bind(this) },
          { prop: 'Status', as: 'File Status', cellTemplate: DataTableTemplates.WebJobStatus },
          { prop: 'Delete', as: 'Action', cellClasses: 'anchor-text', cellTemplate: DataTableTemplates.Custom, template: this.downloadTemplate.bind(this) },

      ],
      events: {
          rowClicked: this.gridRowClicked2.bind(this)
      },
      settings: {
          search: false,
      }
  };
    constructor(private orderService: OrdersService, private loadingService: LoaderSeviceService, private router:Router) { }

    ngOnInit() {
        this.GetActivity(null, null);
        this.DateFilterTo = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
        this.DateFilterFrom = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    }
    Generate(isTest){
      this.scheduleReminderoption = false
      let configObj = {
        Data: null,
        Filename: null,
        TotalIncentiveDisbursed: null
    };
      let user = JSON.parse(localStorage.getItem('currentUser'));

      this.orderService.Generate(isTest,user['username'], {}).subscribe(
          response => {
            alert("Request submitted successfully");
            this.GetActivity(null, null);
          },
          error => {console.log(error)}
      );
    }
    scheduleToggleForGenerateTestFile(isTest){
      this.isTest = isTest
      this.scheduledTime = undefined
      this.scheduledDate = undefined
      this.scheduleReminderoption = true
    }

    scheduleToggleForGenerate(isTest){
        this.isTest = isTest
        this.scheduledTime = undefined
        this.scheduledDate = undefined
        this.scheduleReminderoption = true
    }

    scheduleGenerate() {
      if (this.scheduledTime === undefined ||
        this.scheduledDate === undefined) {
          if (this.scheduledTime === undefined) {
            this.scheduleTimeFlag = true
          } else {
            this.scheduleTimeFlag = false
          }
          if (this.scheduledDate === undefined) {
            this.scheduleDateFlag = true
          } else {
            this.scheduleDateFlag = false
          }
          return
    }
        this.scheduleDateFlag = false
        this.scheduleTimeFlag = false
        const hrs = this.scheduledTime.split(":")[0];
        const mins = this.scheduledTime.split(":")[1];
        const date = new Date(
          this.scheduledDate.year,
          this.scheduledDate.month - 1,
          this.scheduledDate.day,
          parseInt(hrs),
          parseInt(mins),
          0
        );

        const monthWithZero = date.getUTCMonth() + 1;
        const year = date.getUTCFullYear();
        const month = monthWithZero >= 10 ? monthWithZero : "0" + monthWithZero;
        const day =
          date.getUTCDate() >= 10 ? date.getUTCDate() : "0" + date.getUTCDate();
        const hh =
          date.getUTCHours() >= 10 ? date.getUTCHours() : "0" + date.getUTCHours();
        const min =
          date.getUTCMinutes() >= 10
            ? date.getUTCMinutes()
            : "0" + date.getUTCMinutes();

        const filterDate = `${year}-${month}-${day}`
        const filterTime = `${hh}:${min}`
        let user = JSON.parse(localStorage.getItem('currentUser'));

        let configObj = {
            Data: null,
            Filename: 'abc.csv',
            TotalIncentiveDisbursed: '',
            ScheduleDate: filterDate,
            ScheduleTime: filterTime
        };
        console.log(configObj)
        let userName = JSON.parse(localStorage.getItem('currentUser'));
        this.orderService.Generate(this.isTest,userName['username'], configObj).subscribe(
            response => {
              alert("Request submitted successfully");
              this.GetActivity(null, null);
            },
            error => {console.log(error)}
        );
    }

    isTestTemplate(row) {
        if (row.IsTest == 1)
            return "YES";
        else return "NO";
    }
    downloadTemplate(row) {
        if (row.Status == 7) {
            return '<i  class="fa fa-download ele-click"></i>';
        } else if (row.Status == 1){
          return '<i class="fa fa-times ele-click"></i>';
        } else {
          return "";
        }
    }
    viewDetailsTemplate(row){
      if(row['FileURL1'] !== null && row['FileURL1'].trim() !== ""){
        return '<i  class="fa fa-download ele-click"></i>';
      }
      else{
        return "";
      }
    }

    resultTemplate(row) {
      let result = "";
      if (row.MetaData) {
        let tempresult = JSON.parse(row.MetaData);
        if (tempresult.ScheduleDate == null || tempresult.ScheduleTime == null) {
          result = ""
        } else {
          let localDate = tempresult.ScheduleDate+"T"+tempresult.ScheduleTime+":00.000Z"
          let scheduleDate = new Date(localDate)
          result += scheduleDate;
        }
      }
      return result;
    }

    gridRowClicked(ev, row, column) {
        if (column.prop == "ViewDetails" && (row.Status == 7 || row.Status == 6 || row.Status == 99)) {
            this.orderService.DownloadMailer('1', row.FileURL1).subscribe(
                response => { FileSaver.saveAs(response, row['FileURL1']); },
                error => console.log(error)
            );
        }
        function getFormatDate(str){
           return str = str> 9 ? str : "0"+str;
        }
        if (column.prop == "Download" && row.Status == 7) {
            this.orderService.DownloadMailerIncentiveDetails('1', row['FileURL2']).subscribe(
                response => {
                    let date = new Date(row.CreatedOn);
                    let filename = 'arb' + date.getFullYear() + getFormatDate(date.getMonth() + 1) + getFormatDate(date.getDate()) + '_' + getFormatDate(date.getHours()) + getFormatDate(date.getMinutes()) + '_incentive.txt';
                    FileSaver.saveAs(response, filename);
                },
                error => console.log(error)
            );
        }
        else if (column.prop == "Download" && row.Status == 1) {
          this.orderService.DeleteActivity(row.ID).subscribe(
            response => {
              this.GetActivity(null, null);
            },
            error => console.log(error)
        );
        }
    }

    gridRowClicked2(ev, row, column) {
      function getFormatDate(str){
         return str = str> 9 ? str : "0"+str;
      }
      if (column.prop == "Delete" && row.Status == 1) {
          this.orderService.DeleteActivity(row.ID).subscribe(
              response => {
                console.log('as', response)
                this.GetActivity(null, null);

              },
              error => console.log(error)
          );
      }
  }

  tempFunction(gridBindingData) {
    this.gridData2.data = []
    if (gridBindingData !== undefined) {
      gridBindingData.forEach(ele => {
        let tempresult = JSON.parse(ele.MetaData);
        let status = parseInt(ele.Status)
        if (status < 7 && (tempresult.ScheduleDate !== null || tempresult.ScheduleTime !== null)) {
          this.gridData2.data.push(ele)
        }
      });
      this.loadingService.HideLoader();
    }
  }

    GetActivity(dateFrom, dateTo) {
        this.orderService.GetDisbursementHistory("5", dateFrom, dateTo).subscribe(
            response => {
              this.gridData.data = response;
              this.gridBindingData = response;
              this.BindChart(response)
              console.log(response);
              this.tempFunction(this.gridBindingData);
              },
            error => console.log(error)
        );
    }

    OpenIncentiveReports(){
      let confirmation = confirm('Generating the Incentive Report preview can be time consuming. You can generate the preview using the Generate Test file feature below. Do you still want to continue?');
      if(confirmation){
        this.router.navigate(['/fullincentives/report'])
      }
    }


    GetHistory() {
        let dateFrom = this.DateFilterFrom.year + "-" + this.DateFilterFrom.month + "-" + this.DateFilterFrom.day;
        let dateTo = this.DateFilterTo.year + "-" + this.DateFilterTo.month + "-" + this.DateFilterTo.day;
        this.GetActivity(dateFrom, dateTo);
    }

    BindChart(response) {
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
                "series": [{ "values": [], "text": "Total Sum Disbursed" }]
            }

        }
        for (var index in response) {
            let row = response[index];
            let dateMoment = new Date(row.CreatedOn + "Z")
            let day = dateMoment.getDate();
            let month = dateMoment.getMonth() + 1;
            let year = dateMoment.getFullYear();
            let finalDate = month + "-" + day + "-" + year;
            config.data["scale-x"].labels.push(finalDate);
            config.data.series[0].values.push(row.RecordsGenerated);
        }
        this.chart = new Chart(config);
    }
}
