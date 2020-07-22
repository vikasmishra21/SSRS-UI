import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { NgbModal, NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SqlFilterQueryBuilderComponent } from '../../common/sql-filter-query-builder/sql-filter-query-builder.component';
import { Router, RouterModule } from '@angular/router';
import { Activity } from "../../_models/models";
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import { FinalDataExtractReportComponent } from '../final-data-extract-report/final-data-extract-report.component';

import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-final-data-extract',
    templateUrl: './final-data-extract.component.html',
    styleUrls: ['./final-data-extract.component.css']
})
export class FinalDataExtractComponent implements OnInit {

  scheduledDate: NgbDateStruct;
  scheduledTime: any;
  scheduleReminderoption: boolean = false;
  scheduleDateFlag: boolean = false;
  scheduleTimeFlag: boolean = false;
    pulledObject = {
        Type: "1",
        markTest: false
    };
    filterString = '';
    pulledRecordsCount = 0;
    group = {
        rules: [{ "operator": "&&", "rules": [] }]
    }
    gridData = {
        data: [],
        columnconfig: [
            { prop: 'CreatedOn', as: 'Pulled On', cellTemplate: 9 },
            { prop: 'CreatedBy', as: 'Pulled By' },
            { prop: 'MetaData', as: 'Scheduled Date', cellTemplate: DataTableTemplates.Custom, template: this.scheduleTemplate.bind(this) },
            { prop: 'FilterUsed', as: 'Filters Used' },
            { prop: 'RecordsGenerated', as: 'Records Pulled' },
            { prop: 'IsTest', as: 'Pull Type', cellTemplate: DataTableTemplates.Custom, template: this.isTestTemplate.bind(this) },
            { prop: 'Status', as: 'Status', cellTemplate: DataTableTemplates.WebJobStatus },
            { prop: 'download', as: 'Actions', cellClasses: 'anchor-text', cellTemplate: DataTableTemplates.Custom, template: this.downloadTemplate.bind(this) },
            { prop: 'downloadpartial', as: 'Download Partial', cellClasses: 'anchor-text', cellTemplate: DataTableTemplates.Custom, template: this.downloadTemplate.bind(this) },
            { prop: 'DownloadHistory', as: 'Download History' },
            { prop: 'ViewReport', as: 'View Report', cellClasses: 'anchor-text', cellTemplate: 5 }
        ],
        events: {
            rowClicked: this.gridRowClicked.bind(this)
        },
        settings: {
            search: true
        }
    };
    orderCode: string;
    orderType: string;
    constructor(private router: Router, private orderService: OrdersService,
        private modalService: NgbModal) { }

    ngOnInit() {
        this.orderCode = this.orderService.GetOrderCode();
        this.orderType = this.orderService.GetOrderType();
        if (!this.orderCode || !this.orderType) {
            this.router.navigate(['/orders/overview']);
        } else
            this.Bind();
    }

    downloadTemplate(row, column) {
        if (column == "download" && row.FileURL1 && row.Status == 7) {
            return '<i  class="fa fa-download ele-click"></i>';
        }
        else if (column == "downloadpartial" && row.FileURL2 && row.Status == 7) {
            return '<i  class="fa fa-download ele-click"></i>';
        } else if (column == "download" && row.Status == 1){
          return '<i class="fa fa-times ele-click"></i>';
        } else {
          return "";
        }
    }

    scheduleTemplate(row) {
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

    isTestTemplate(row) {
        if (row.IsTest == 1)
            return "TEST";
        else return "LIVE";
    }
    gridRowClicked(ev, row, column) {
        if (column.prop == "download" && row.Status == 7) {
            this.orderService.DownloadMailerIncentiveDetails(this.orderCode, row['FileURL1']).subscribe(
                response => { FileSaver.saveAs(response, row['FileURL1']); this.UpdateActivity(row); },
                error => console.log(error)
            );

            console.log(row);
        } else if (column.prop == "ViewReport") {
            this.orderService.ViewReport(this.orderCode, row['ID']).subscribe(
                response => {
                    this.OpenFinalExtractDataReport(response);
                },
                error => console.log(error)
            )
            console.log(row);
        } else if (column.prop == "downloadpartial" && row.Status == 7) {
            this.orderService.DownloadMailerIncentiveDetails(this.orderCode, row['FileURL2']).subscribe(
                response => {
                    FileSaver.saveAs(response, row['FileURL2']);
                    //  this.UpdateActivity(row);
                },
                error => console.log(error)
            );

            console.log(row);
        } else if (column.prop == "download" && row.Status == 1) {
          this.orderService.DeleteActivity(row.ID).subscribe(
            response => {
              console.log('as', response)
              this.UpdateActivity(row);
            },
            error => console.log(error)
        );
        }
    }

    PullOrder() {
      this.scheduleReminderoption = false;
        let user = JSON.parse(localStorage.getItem('currentUser'));

        let configObj = {
            Condition: this.pulledObject.Type,
            IsTest: this.pulledObject.markTest ? "1" : "0",
            Filter: this.filterString,
            username: user['username']
        };
        this.orderService.PullData(this.orderCode, configObj).subscribe(
            response => { this.Bind(); console.log(response); },
            error => console.log(error)
        );
    }

    OpenFinalExtractDataReport(response) {
        const modalRef = this.modalService.open(FinalDataExtractReportComponent);
        modalRef.componentInstance.response = response;
    }

    Bind() {
        this.filterString = '';
        this.BindRemainingPulledCount(this.pulledObject.Type);
        this.BindHistory();
    }

    BindRemainingPulledCount(event) {
        this.pulledObject.Type = event;

        let configObj = {
            Condition: event,
            Filter: this.filterString
        };
        this.orderService.GetPullRecordCount(this.orderCode, this.orderType, configObj).subscribe(
            response => { this.pulledRecordsCount = response; console.log(response) },
            error => console.log(error)
        );
    }

    BindHistory() {
        this.orderService.GetInitialMailerHistory(this.orderCode, "4").subscribe(
            response => {
                this.gridData.data = response;
            },
            error => console.log(error)
        );
    }

    InsertActivity(filename: string) {
        var user = JSON.parse(localStorage.getItem('currentUser'));
        var activity = new Activity();
        activity.ActivityType = 4;
        activity.FilterUsed = this.filterString;
        activity.OrderCode = this.orderCode;
        activity.FileURL1 = filename;
        activity.CreatedBy = user.username;
        activity.RecordsGenerated = this.pulledRecordsCount;
        this.orderService.InsertActivity(activity).subscribe(
            response => { this.Bind(); },
            error => { console.log(error); }
        );
    }
    UpdateActivity(activity) {
        if (activity.DownloadHistory)
            activity.DownloadHistory += 'Downloaded By Admin;';
        else
            activity.DownloadHistory = 'Downloaded By Admin;';
        this.orderService.UpdateActivity(activity).subscribe(
            response => { this.Bind(); },
            error => { console.log(error); }
        );
    }

    ShowFilterPopup() {
        const modalRef = this.modalService.open(SqlFilterQueryBuilderComponent);
        this.orderService.GetFiletrVariablesFinalExtractByOrderType(this.orderService.GetOrderType()).subscribe(
            response => modalRef.componentInstance.fields = response,
            error => console.log(error)
        );

        modalRef.componentInstance.group = this.group;

        modalRef.result.then((result) => {
            this.group = result.group;
            this.filterString = JSON.parse(result.condition);
            this.BindRemainingPulledCount("2");
        });
    }

    scheduleToggle() {
      this.scheduleReminderoption = true;
    }

    scheduledPullOrder() {
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
            Condition: this.pulledObject.Type,
            IsTest: this.pulledObject.markTest ? "1" : "0",
            Filter: this.filterString,
            username: user['username'],
            ScheduleDate: filterDate,
            ScheduleTime: filterTime,
        };
        console.log(configObj)
        this.orderService.PullData(this.orderCode, configObj).subscribe(
            response => { this.Bind(); console.log(response); },
            error => console.log(error)
        );
    }
}


