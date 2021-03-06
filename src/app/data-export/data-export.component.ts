import { Component, OnInit } from "@angular/core";
import { DataTableTemplates } from "../_enums/data-table-templates.enum";
import { Router } from "@angular/router";
import { OrdersService } from "../_services/orders.service";
import { NgbModal, NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { SqlFilterQueryBuilderComponent } from "../common/sql-filter-query-builder/sql-filter-query-builder.component";
import { ColumnSelectorDialogComponent } from "../orders/column-selector-dialog/column-selector-dialog.component";
import * as FileSaver from "file-saver";
import { OrderType } from "../_enums/enums.enum";

@Component({
  selector: "app-data-export",
  templateUrl: "./data-export.component.html",
  styleUrls: ["./data-export.component.css"],
})
export class DataExportComponent implements OnInit {
  gridData = {
    data: [],
    columnconfig: [
      { prop: "CreatedOn", as: "Generated On", cellTemplate: 9 },
      { prop: "CreatedBy", as: "Generated By" },
      {
        prop: "MetaData",
        as: "Scheduled Date",
        cellTemplate: DataTableTemplates.Custom,
        template: this.resultTemplateDate.bind(this),
      },
      {
        prop: "MetaData",
        as: "Details",
        cellTemplate: DataTableTemplates.Custom,
        template: this.resultTemplate.bind(this),
      },
      {
        prop: "Status",
        as: "Status",
        cellTemplate: DataTableTemplates.WebJobStatus,
      },
      {
        prop: "Download",
        as: "Actions",
        cellClasses: "anchor-text",
        cellTemplate: DataTableTemplates.Custom,
        template: this.downloadTemplate.bind(this),
      },
    ],
    events: {
      rowClicked: this.gridRowClicked.bind(this),
    },
    settings: {
      search: false,
    },
  };

  constructor(
    private router: Router,
    private orderService: OrdersService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.gridDataCall();
  }

  gridDataCall() {
    this.orderService.GetDataExportGrid().subscribe((response) => {
      this.gridData.data = response;
    });
  }

  resultTemplateDate(row) {
    let result = "";
    if (row.MetaData) {
      let tempresult = JSON.parse(row.MetaData);
      if (tempresult.ScheduleDate == null || tempresult.ScheduleTime == null) {
        result = "";
      } else {
        let localDate =
          tempresult.ScheduleDate + "T" + tempresult.ScheduleTime + ":00.000Z";
        let scheduleDate = new Date(localDate);
        result += scheduleDate;
      }
    }
    return result;
  }

  resultTemplate(row) {
    let result = "";
    if (row.MetaData) {
      let tempresult = JSON.parse(row.MetaData);
      let orderType =
        tempresult.Ordertype == 2
          ? "PPM"
          : tempresult.Ordertype == 3
          ? "PR"
          : "Diary";
      let tableType = tempresult.TableType == 1 ? "Finalized" : "Staging";
      let fileType = tempresult.FileType == 1 ? "CSV" : "SPSS";
      let DefinitionUsed = tempresult.Definition
        ? tempresult.Definition.Name
        : "null";
      result += "Order List : " + tempresult.OrderList;
      result += "<br/>Definition : " + DefinitionUsed;
      result += "<br/>Order Type : " + orderType;
      result += "<br/>Table Type : " + tableType;
      result += "<br/>File Type : " + fileType;
    }
    return result;
  }

  downloadTemplate(row) {
    if (row.Status == 7) {
      return '<i  class="fa fa-download ele-click"></i>';
    } else if (row.Status == 1) {
      return '<i class="fa fa-times ele-click"></i>';
    } else {
      return "";
    }
  }

  gridRowClicked(ev, row, column) {
    function getFormatDate(str) {
      return (str = str > 9 ? str : "0" + str);
    }
    if (column.prop == "Download" && row.Status == 7) {
      this.orderService.DownloadZip(row["FileURL1"]).subscribe(
        (response) => {
          let date = new Date(row.CreatedOn);
          let filename = row["FileURL1"].split("\\")[2];
          FileSaver.saveAs(response, filename);
        },
        (error) => console.log(error)
      );
    } else if (column.prop == "Download" && row.Status == 1) {
      this.orderService.DeleteActivity(row.ID).subscribe(
        (response) => {
          this.orderService
            .GetVisibleCashTestActivity()
            .subscribe((response) => {
              this.gridData.data = response;
            });
          console.log("as", response);
        },
        (error) => console.log(error)
      );
    }
  }

  // public setValue(name, value) {
  //   let _o = {};
  //   let params = this.queryString.split(this._and);
  //   if (params[0] !== "") {
  //     for (let i = 0; i < params.length; i++) {
  //       let keyValues = params[i].split(this._eq);
  //       _o[keyValues[0]] = keyValues[1].split(",");
  //     }
  //   }

  //   if (_o[name] && _o[name].indexOf("" + value) > -1) {
  //     _o[name].splice(_o[name].indexOf("" + value), 1);
  //   } else {
  //     _o[name] = _o[name] ? _o[name].concat(value) : [value];
  //   }
  //   let newStr = "";
  //   let and = "";
  //   Object.keys(_o).map((key) => {
  //     if (_o[key][0] === "") {
  //       _o[key].splice(0, 1);
  //     }
  //     if (_o[key].length === 0) {
  //     } else {
  //       newStr += and + key + this._eq + _o[key].join(",");
  //       and = this._and;
  //     }
  //   });
  //   this.queryString = newStr;
  //   console.log(this.queryString);
  //   return this.queryString;
  // }

  // getContentWidth() {
  //   var width = document.getElementById("brandData").offsetWidth;
  //   return width;
  // }

  newExport() {
    this.router.navigate(["dataexport/newexport"]);
  }
}
