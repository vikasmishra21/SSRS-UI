import { Component, OnInit } from "@angular/core";
import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { DataTableTemplates } from "../_enums/data-table-templates.enum";
import { OrdersService } from '../_services/orders.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: "app-compare-order",
  templateUrl: "./compare-order.component.html",
  styleUrls: ["./compare-order.component.css"],
})
export class CompareOrderComponent implements OnInit {
  ControlDateFilterFrom: NgbDateStruct;
  ControlDateFilterTo: NgbDateStruct;
  TestDateFilterFrom: NgbDateStruct;
  TestDateFilterTo: NgbDateStruct;
  searchControl: string;
  searchTest: string;
  controlOrderCode: string = '';
  testOrderCode: string = '';
  controlTestOrderArray: any
  OrderDetailsResponse: any
  selectedOrderTypeCode = 2
  controlDateFromFlag = false
  controlDateToFlag = false
  testDateFromFlag = false
  testDateToFlag = false
  controlOrderCodeFlag = false
  testOrderCodeFlag = false

  scheduledDate: NgbDateStruct;
  scheduledTime: any;
  scheduleReminderoption: boolean = false;
  scheduleDateFlag: boolean = false;
  scheduleTimeFlag: boolean = false;
  OrderType = [
    {code: 2, name: 'PPM'},
    {code: 3, name: 'Metro'},
    {code: 4, name: 'Non Metro'},
  ]
  count: number = 0;
  gridData = {
    data: [],
    columnconfig: [
      { prop: "CreatedOn", as: "Generated On", cellTemplate: 9 },
      { prop: "CreatedBy", as: "Generated By" },
      { prop: 'MetaData', as: 'Scheduled Date', cellTemplate: DataTableTemplates.Custom, template: this.scheduleTemplate.bind(this) },
      { prop: 'MetaData', as: 'Details', cellTemplate: DataTableTemplates.Custom, template: this.resultTemplate.bind(this) },
      { prop: 'Status', as: 'Status', cellTemplate: DataTableTemplates.WebJobStatus },
      {
        prop: "Download",
        as: "Actions",
        cellClasses: "anchor-text",
        cellTemplate: DataTableTemplates.Custom,
        template: this.downloadTemplate.bind(this),
      }
    ],
    events: {
      rowClicked: this.gridRowClicked.bind(this),
    },
    settings: {
      search: false,
    },
  };

  constructor(private orderService: OrdersService) {}

  ngOnInit() {
    this.orderService.GetVisibleCashTestActivity().subscribe(response => {
      this.gridData.data = response
    })

    this.orderService.GetOrderDetailsForVisibleCash().subscribe(
      response => {
        this.OrderDetailsResponse = response
        const orderDetailsResponse = this.OrderDetailsResponse.filter((code) => {
          return code.Ordertype === 2
        })
        this.controlTestOrderArray = orderDetailsResponse
      }
      )

    }

    setOrderType(orderCode) {
      this.selectedOrderTypeCode = parseInt(orderCode)
      const orderDetailsResponse = this.OrderDetailsResponse.filter((code) => {
        return code.Ordertype === this.selectedOrderTypeCode
      })
      this.controlTestOrderArray = orderDetailsResponse
    }

    resultTemplate(row) {
      let result = "";
      if (row.MetaData) {
        let tempresult = JSON.parse(row.MetaData);
        result += "Control Order Code : " + tempresult.ControlOrderCode;
        result += "<br/>Control Order StartDate : " + tempresult.ControlOrderStartDate;
        result += "<br/>Control Order EndDate : " + tempresult.ControlOrderEndDate;
        result += "<br/>Test Order Code : " + tempresult.TestOrderCode;
        result += "<br/>Test Order StartDate : " + tempresult.TestOrderStartDate;
        result += "<br/>Test Order EndDate : " + tempresult.TestOrderEndDate;
      }
      return result;
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

  downloadTemplate(row) {
    if (row.Status == 7) {
      return '<i  class="fa fa-download ele-click"></i>';
    } else if (row.Status == 1){
      return '<i class="fa fa-times ele-click"></i>';
    } else {
      return "";
    }
  }

  gridRowClicked(ev, row, column) {
    function getFormatDate(str){
      return str = str> 9 ? str : "0"+str;
   }
    if (column.prop == "Download" && row.Status == 7) {
      this.orderService.DownloadOrderComparisonExcel('1', row['FileURL1']).subscribe(
          response => {
              let date = new Date(row.CreatedOn);
              let filename = row['FileURL1'].split("\\")[1]
              FileSaver.saveAs(response, filename);
          },
          error => console.log(error)
      );
  } else if (column.prop == "Download" && row.Status == 1) {
    this.orderService.DeleteActivity(row.ID).subscribe(
      response => {
        this.orderService.GetVisibleCashTestActivity().subscribe(response => {
          this.gridData.data = response
        })
        console.log('as', response)
      },
      error => console.log(error)
  );
  }
  }


  Generate() {
    this.scheduleReminderoption = false;
    if (this.ControlDateFilterFrom === undefined ||
        this.ControlDateFilterTo === undefined ||
        this.TestDateFilterFrom === undefined ||
        this.TestDateFilterTo === undefined ||
        this.controlOrderCode === '' ||
        this.testOrderCode === '') {
          if (this.ControlDateFilterFrom === undefined) {
            this.controlDateFromFlag = true
          } else {
            this.controlDateFromFlag = false
          }
          if (this.ControlDateFilterTo === undefined) {
            this.controlDateToFlag = true
          } else {
            this.controlDateToFlag = false
          }
          if (this.TestDateFilterFrom === undefined) {
            this.testDateFromFlag = true
          } else {
            this.testDateFromFlag = false
          }
          if (this.TestDateFilterTo === undefined) {
            this.testDateToFlag = true
          } else {
            this.testDateToFlag = false
          }
          if (this.controlOrderCode === '') {
            this.controlOrderCodeFlag = true
          } else {
            this.controlOrderCodeFlag = false
          }
          if (this.testOrderCode === '') {
            this.testOrderCodeFlag = true
          } else {
            this.testOrderCodeFlag = false
          }
          return
    }

    let dateFromControl = this.ControlDateFilterFrom.year + "-" + this.ControlDateFilterFrom.month + "-" + this.ControlDateFilterFrom.day;
    let dateToControl = this.ControlDateFilterTo.year + "-" + this.ControlDateFilterTo.month + "-" + this.ControlDateFilterTo.day;
    let dateFromTest = this.TestDateFilterFrom.year + "-" + this.TestDateFilterFrom.month + "-" + this.TestDateFilterFrom.day;
    let dateToTest = this.TestDateFilterTo.year + "-" + this.TestDateFilterTo.month + "-" + this.TestDateFilterTo.day;

    let payload = {
      "OrderType": this.selectedOrderTypeCode,
      "ControlOrderCode": this.controlOrderCode,
      "ControlOrderStartDate": dateFromControl,
      "ControlOrderEndDate": dateToControl,
      "TestOrderCode": this.testOrderCode,
      "TestOrderStartDate": dateFromTest,
      "TestOrderEndDate": dateToTest
    }

    this.orderService.CompareOrderGenerate(payload).subscribe(
      response => { this.orderService.GetVisibleCashTestActivity().subscribe(response => {
        this.gridData.data = response
      })}
    )
    }

    scheduledGenerate() {
      if (this.ControlDateFilterFrom === undefined ||
        this.ControlDateFilterTo === undefined ||
        this.TestDateFilterFrom === undefined ||
        this.TestDateFilterTo === undefined ||
        this.controlOrderCode === '' ||
        this.testOrderCode === '' || this.scheduledTime === undefined ||
        this.scheduledDate === undefined) {
          if (this.ControlDateFilterFrom === undefined) {
            this.controlDateFromFlag = true
          } else {
            this.controlDateFromFlag = false
          }
          if (this.ControlDateFilterTo === undefined) {
            this.controlDateToFlag = true
          } else {
            this.controlDateToFlag = false
          }
          if (this.TestDateFilterFrom === undefined) {
            this.testDateFromFlag = true
          } else {
            this.testDateFromFlag = false
          }
          if (this.TestDateFilterTo === undefined) {
            this.testDateToFlag = true
          } else {
            this.testDateToFlag = false
          }
          if (this.controlOrderCode === '') {
            this.controlOrderCodeFlag = true
          } else {
            this.controlOrderCodeFlag = false
          }
          if (this.testOrderCode === '') {
            this.testOrderCodeFlag = true
          } else {
            this.testOrderCodeFlag = false
          }
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
    let dateFromControl = this.ControlDateFilterFrom.year + "-" + this.ControlDateFilterFrom.month + "-" + this.ControlDateFilterFrom.day;
    let dateToControl = this.ControlDateFilterTo.year + "-" + this.ControlDateFilterTo.month + "-" + this.ControlDateFilterTo.day;
    let dateFromTest = this.TestDateFilterFrom.year + "-" + this.TestDateFilterFrom.month + "-" + this.TestDateFilterFrom.day;
    let dateToTest = this.TestDateFilterTo.year + "-" + this.TestDateFilterTo.month + "-" + this.TestDateFilterTo.day;
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

    let payload = {
      "OrderType": this.selectedOrderTypeCode,
      "ControlOrderCode": this.controlOrderCode,
      "ControlOrderStartDate": dateFromControl,
      "ControlOrderEndDate": dateToControl,
      "TestOrderCode": this.testOrderCode,
      "TestOrderStartDate": dateFromTest,
      "TestOrderEndDate": dateToTest,
      "ScheduleDate": filterDate,
      "ScheduleTime": filterTime,
    }

    this.orderService.CompareOrderGenerate(payload).subscribe(
      response => { this.orderService.GetVisibleCashTestActivity().subscribe(response => {
        this.gridData.data = response
      })}
    )
    }

    scheduleToggle() {
      this.scheduleReminderoption = true;
    }

    setValueControl(code,id) {
      console.log(code)
      this.controlOrderCode = code
      const allIcons = document.getElementsByClassName('controlOrder');
      for (let i = 0; i < allIcons.length; i++) {
        allIcons[i].classList.remove('selected');
      }
      var icon = document.getElementById(id);
      if (icon.classList.contains("selected")) {
        icon.classList.remove("selected");
      }
      else {
        icon.classList.add("selected");
      }
      setTimeout(() => {
      this.controlOrderRadio('radio'+ id);
      })
    }

    controlOrderRadio(id){
       document.getElementById(id).setAttribute("checked", "checked");
    }

    setValueTest(code,id) {
      console.log(code)
      this.testOrderCode = code
      const allIcons = document.getElementsByClassName('testOrder');
      for (let i = 0; i < allIcons.length; i++) {
        allIcons[i].classList.remove('selected');
      }
      var icon = document.getElementById(id);
      if (icon.classList.contains("selected")) {
        icon.classList.remove("selected");
      }
      else {
        icon.classList.add("selected");
      }
      setTimeout(() => {
      this.testOrderRadio('radioTest'+ id);
      })
    }

    testOrderRadio(id){
      document.getElementById(id).setAttribute("checked", "checked");
    }
}
