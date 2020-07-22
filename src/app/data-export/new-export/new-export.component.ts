import { Component, OnInit } from "@angular/core";
import { NgbDateStruct, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { OrderType, FileType } from "../../_enums/enums.enum";
import { OrdersService } from "../../_services/orders.service";
import { Router } from "@angular/router";
import { SqlFilterQueryBuilderComponent } from "../../common/sql-filter-query-builder/sql-filter-query-builder.component";
import { ColumnSelectorDialogComponent } from "../../orders/column-selector-dialog/column-selector-dialog.component";
import { ExportDefinition } from "../export-definition";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
  selector: "app-new-export",
  templateUrl: "./new-export.component.html",
  styleUrls: ["./new-export.component.css"],
})
export class NewExportComponent implements OnInit {
  OrderTypeEnum = OrderType;
  FileTypeEnum = FileType;
  selectedOrderTypeCode = 2;
  selectedVersionCode = 2;
  selectedFileTypeCode = 1;
  scheduledDate: NgbDateStruct;
  scheduledTime: any;
  scheduleReminderoption: boolean = false;
  scheduleDateFlag: boolean = false;
  scheduleTimeFlag: boolean = false;
  OrderType = [
    { code: 1, name: "Diary" },
    { code: 2, name: "PPM" },
    { code: 3, name: "PR" },
  ];
  TableVersion = [
    { code: 1, name: "Finalized" },
    { code: 2, name: "Staging" },
  ];
  FileType = [
    { code: 1, name: "CSV" },
    { code: 2, name: "SPSS" },
  ];

  searchOrder = "";
  searchDefinition = "";
  group = {
    rules: [{ operator: "&&", rules: [] }],
  };
  public queryString = "";
  public _and = "and";
  public _eq = "eq";
  marked: boolean = false;
  controlTestOrderArray: any;
  OrderDetailsResponse: any;
  toFilterFields: any = [];
  filterString: string = "";
  dummyColumnConfig: any = [];
  gridcolumnBind: any = [];
  dataExportDefinitions: any;
  columnSelector: string = "";
  newDefinition: boolean = false;
  isDefinitionNameEmpty: boolean = false;
  isDefinitionDescriptionEmpty: boolean = false;
  definitionName: string = "";
  definitionDescription: string = "";
  selectedDefinition: any;
  isSelectedDefinitionEmpty: boolean = false;
  isOrderListEmpty: boolean = false;

  constructor(
    private orderService: OrdersService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getDataExportTableData();
    this.getDefinitions();
  }

  getDataExportTableData() {
    this.orderService.GetOrderForDataExportGrid().subscribe((response) => {
      for (let index = 0; index < response.length; index++) {
        response[index].CreatedOn = new Date(response[index].CreatedOn + "Z");
        response[index].HardCloseDate = new Date(
          response[index].HardCloseDate + "Z"
        );
      }

      this.OrderDetailsResponse = response;
      const orderDetailsResponse = this.OrderDetailsResponse.filter((code) => {
        return code.OrderType === 2;
      });
      this.controlTestOrderArray = orderDetailsResponse;
    });
    this.forFilterAndSelection();
  }

  getDefinitions() {
    this.orderService.GetDataExportDefinition().subscribe(
      (response) => {
        for (let index = 0; index < response.length; index++) {
          response[index].CreatedOn = new Date(response[index].CreatedOn + "Z");
        }
        this.dataExportDefinitions = response;
      },
      (err) => {
        this.dataExportDefinitions = [];
      }
    );
  }

  forFilterAndSelection() {
    this.orderService
      .GetStructure(this.selectedOrderTypeCode.toString())
      .subscribe((data) => {
        this.toFilterFields = data;
        let columns = Object.keys(this.toFilterFields);
        this.gridcolumnBind = [];
        for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
          let column = {};
          column["prop"] = this.toFilterFields[columnIndex]["DBColumnName"]
            .replace("[", "")
            .replace("]", "");
          column["as"] = this.toFilterFields[columnIndex]["DisplayName"];
          if (
            this.toFilterFields[columnIndex]["DataType"].toLowerCase() ==
            "datetime"
          )
            column["cellTemplate"] = 9;
          this.gridcolumnBind.push(column);
        }
        this.dummyColumnConfig = Object.assign([], this.gridcolumnBind);
      });
  }

  scheduleToggle() {
    this.scheduleReminderoption = true;
  }

  setFieldType(name, orderCode) {
    console.log(name, orderCode);
    this.isSelectedDefinitionEmpty = false;
    this.queryString = "";
    this.selectedOrderTypeCode = parseInt(orderCode);
    const orderDetailsResponse = this.OrderDetailsResponse.filter((code) => {
      return code.OrderType === this.selectedOrderTypeCode;
    });
    this.controlTestOrderArray = orderDetailsResponse;
    this.forFilterAndSelection();
  }

  public openOrder(order: any) {
    this.orderService.SetOrderCode(order.OrderCode, order.OrderType.toString());
    this.router.navigate(["/orders/orderdetails"]);
  }

  getFilterFields() {
    let fields = [];
    for (var i = 0; i < this.toFilterFields.length; i++) {
      let field = {};
      field["name"] = this.toFilterFields[i]["DisplayName"];
      field["column"] = this.toFilterFields[i]["DBColumnName"];
      field["type"] = "string";
      fields.push(field);
    }
    return fields;
  }

  ShowFilterPopup(event) {
    const modalRef = this.modalService.open(SqlFilterQueryBuilderComponent);
    modalRef.componentInstance.fields = this.getFilterFields();

    modalRef.componentInstance.group = this.group;

    modalRef.result.then((result) => {
      this.group = result.group;
      this.filterString = JSON.parse(result.condition);
    });
  }

  OpenColumnSelector() {
    const modalRef = this.modalService.open(ColumnSelectorDialogComponent, {
      size: "sm",
    });
    modalRef.componentInstance.ResponseHeaders = this.dummyColumnConfig;
    modalRef.result.then((result) => {
      if (result != null) {
        this.columnSelector = "";
        for (let index = 0; index < result.length; index++) {
          const prop = result[index].prop;
          this.columnSelector += "[" + prop + "]" + ",";
        }

        this.columnSelector = this.columnSelector.substring(
          0,
          this.columnSelector.length - 1
        );
      }
    });
  }

  getConfigObject(scheduleDate?: string, scheduleTime?: string): any {
    const gridId = this.queryString.split("eq")[1].split(",");
    // let innerconfibobj = {ID: this.selectedDefinition.ID}
    let configObj = {
      Definition: { ID: this.selectedDefinition.ID },
      OrderList: gridId,
      Ordertype: this.selectedDefinition.OrderType,
      TableType: this.selectedDefinition.TableVersion,
      FileType: this.selectedDefinition.FileType,
      Columns: this.columnSelector,
      Filter: this.filterString,
    };

    if (
      (scheduleDate !== "" || this.scheduledDate !== undefined) &&
      (scheduleTime !== "" || scheduleTime !== undefined)
    ) {
      configObj["ScheduleDate"] = scheduleDate;
      configObj["ScheduleTime"] = scheduleTime;
    }

    return configObj;
  }

  Generate() {
    if (this.validateSelectedFields()) {
      let configObj = this.getConfigObject();
      console.log(configObj);
      let userName = JSON.parse(localStorage.getItem("currentUser"));
      this.orderService
        .GenerateDataExport(userName["username"], configObj)
        .subscribe(
          (response) => {
            alert("Request submitted successfully");
            this.router.navigate(["dataexport"]);
          },
          (error) => {
            console.log(error);
            alert("Error in submitting the request");
          }
        );
    }
  }

  scheduledGenerate() {
    if (this.validateSelectedFields()) {
      if (
        this.scheduledTime === undefined ||
        this.scheduledDate === undefined
      ) {
        if (this.scheduledTime === undefined) {
          this.scheduleTimeFlag = true;
        } else {
          this.scheduleTimeFlag = false;
        }
        if (this.scheduledDate === undefined) {
          this.scheduleDateFlag = true;
        } else {
          this.scheduleDateFlag = false;
        }
        return;
      }
      this.scheduleDateFlag = false;
      this.scheduleTimeFlag = false;
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
        date.getUTCHours() >= 10
          ? date.getUTCHours()
          : "0" + date.getUTCHours();
      const min =
        date.getUTCMinutes() >= 10
          ? date.getUTCMinutes()
          : "0" + date.getUTCMinutes();

      const filterDate = `${year}-${month}-${day}`;
      const filterTime = `${hh}:${min}`;

      let configObj = this.getConfigObject(filterDate, filterTime);

      console.log(configObj);
      let userName = JSON.parse(localStorage.getItem("currentUser"));
      this.orderService
        .GenerateDataExport(userName["username"], configObj)
        .subscribe(
          (response) => {
            alert("Request submitted successfully");
            this.router.navigate(["dataexport"]);
          },
          (error) => {
            alert("Error in submitting the request");
            console.log(error);
          }
        );
    }
  }

  // resultTemplateDate(row) {
  //   let result = "";
  //   if (row.MetaData) {
  //     let tempresult = JSON.parse(row.MetaData);
  //     if (tempresult.ScheduleDate == null || tempresult.ScheduleTime == null) {
  //       result = "";
  //     } else {
  //       let localDate =
  //         tempresult.ScheduleDate + "T" + tempresult.ScheduleTime + ":00.000Z";
  //       let scheduleDate = new Date(localDate);
  //       result += scheduleDate;
  //     }
  //   }
  //   return result;
  // }

  // resultTemplate(row) {
  //   let result = "";
  //   if (row.MetaData) {
  //     let tempresult = JSON.parse(row.MetaData);
  //     let orderType =
  //       tempresult.Ordertype == 2
  //         ? "PPM"
  //         : tempresult.Ordertype == 3
  //         ? "PR"
  //         : "Diary";
  //     let tableType = tempresult.TableType == 1 ? "Finalized" : "Staging";
  //     let fileType = tempresult.FileType == 1 ? "CSV" : "SPSS";
  //     result += "Order List : " + tempresult.OrderList;
  //     result += "<br/>Order Type : " + orderType;
  //     result += "<br/>Table Type : " + tableType;
  //     result += "<br/>File Type : " + fileType;
  //   }
  //   return result;
  // }

  // resultTemplateFilter(row) {
  //   let result = "";
  //   if (row.MetaData) {
  //     let tempresult = JSON.parse(row.MetaData);
  //     if (tempresult.Filter == "") {
  //       result = "";
  //     } else {
  //       result += tempresult.Filter;
  //     }
  //   }
  //   return result;
  // }

  // downloadTemplate(row) {
  //   if (row.Status == 7) {
  //     return '<i  class="fa fa-download ele-click"></i>';
  //   } else if (row.Status == 1) {
  //     return '<i class="fa fa-times ele-click"></i>';
  //   } else {
  //     return "";
  //   }
  // }

  // gridRowClicked(ev, row, column) {
  //   function getFormatDate(str) {
  //     return (str = str > 9 ? str : "0" + str);
  //   }
  //   if (column.prop == "Download" && row.Status == 7) {
  //     this.orderService.DownloadZip(row["FileURL1"]).subscribe(
  //       (response) => {
  //         let date = new Date(row.CreatedOn);
  //         let filename = row["FileURL1"].split("\\")[2];
  //         FileSaver.saveAs(response, filename);
  //       },
  //       (error) => console.log(error)
  //     );
  //   } else if (column.prop == "Download" && row.Status == 1) {
  //     this.orderService.DeleteActivity(row.ID).subscribe(
  //       (response) => {
  //         this.orderService
  //           .GetVisibleCashTestActivity()
  //           .subscribe((response) => {
  //             this.gridData.data = response;
  //           });
  //         console.log("as", response);
  //       },
  //       (error) => console.log(error)
  //     );
  //   }
  // }

  public setValue(name, value) {
    this.isOrderListEmpty = false;
    let _o = {};
    let params = this.queryString.split(this._and);
    if (params[0] !== "") {
      for (let i = 0; i < params.length; i++) {
        let keyValues = params[i].split(this._eq);
        _o[keyValues[0]] = keyValues[1].split(",");
      }
    }

    if (_o[name] && _o[name].indexOf("" + value) > -1) {
      _o[name].splice(_o[name].indexOf("" + value), 1);
    } else {
      _o[name] = _o[name] ? _o[name].concat(value) : [value];
    }
    let newStr = "";
    let and = "";
    Object.keys(_o).map((key) => {
      if (_o[key][0] === "") {
        _o[key].splice(0, 1);
      }
      if (_o[key].length === 0) {
      } else {
        newStr += and + key + this._eq + _o[key].join(",");
        and = this._and;
      }
    });
    this.queryString = newStr;
    console.log(this.queryString);
    return this.queryString;
  }

  getContentWidth() {
    var width = document.getElementById("brandData").offsetWidth;
    return width;
  }

  validateSelectedFields(): boolean {
    let definition = false;
    let order = false;

    if (
      this.selectedDefinition === null ||
      this.selectedDefinition === undefined
    ) {
      this.isSelectedDefinitionEmpty = true;
      definition = true;
    }
    if (this.queryString.trim() === "") {
      this.isOrderListEmpty = true;
      order = true;
    }

    if (order || definition) {
      return false;
    } else {
      return true;
    }
  }

  validateFields(): boolean {
    let name = false;
    let definition = false;

    if (this.definitionName.trim() === "") {
      this.isDefinitionNameEmpty = true;
      name = true;
    }
    if (this.definitionDescription.trim() === "") {
      this.isDefinitionDescriptionEmpty = true;
      definition = true;
    }

    if (name || definition) {
      return false;
    } else {
      return true;
    }
  }

  toggleNewDefinition(type: string) {
    if (type === "new") {
      this.newDefinition = true;
      this.isSelectedDefinitionEmpty = false;
      this.isOrderListEmpty = false;
    } else {
      this.newDefinition = false;
      this.isDefinitionDescriptionEmpty = false;
      this.isDefinitionNameEmpty = false;
      this.clearSelection();
    }
  }

  createExportDefinitionObject(): ExportDefinition {
    let definition = new ExportDefinition();

    definition.Name = this.definitionName;
    definition.Description = this.definitionDescription;
    definition.OrderType = this.selectedOrderTypeCode;
    definition.TableVersion =
      this.selectedVersionCode == 1 ? "Final" : "Staging";
    definition.FileType = this.selectedFileTypeCode;
    definition.Columns = this.columnSelector;
    definition.Filter = this.filterString;
    definition.CreatedBy = this.authenticationService.GetCurrentUserInfo().username;

    return definition;
  }

  saveExportDefinition() {
    if (this.validateFields()) {
      let definition = this.createExportDefinitionObject();
      console.log(definition);
      this.orderService.SaveDataExportDefinition(definition).subscribe(
        (res) => {
          // console.log(res);
          this.getDefinitions();
          this.newDefinition = false;
          this.clearSelection();
          alert("Definition Saved Successfully.");
        },
        (err) => {
          alert("Definition save failed.");
        }
      );
    }
  }

  deleteExportDefinition(id: number, index: number) {
    let confirmation = confirm(
      "Are you sure you want to delete this definition.?"
    );
    if (confirmation) {
      this.orderService.DeleteDataExportDefinition(id).subscribe((res) => {
        this.dataExportDefinitions.splice(index, 1);
      });
    }
  }

  clearSelection() {
    this.definitionName = "";
    this.definitionDescription = "";
    this.selectedDefinition = null;
  }
}
