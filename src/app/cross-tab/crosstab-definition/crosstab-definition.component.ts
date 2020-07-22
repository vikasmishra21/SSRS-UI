import { Component, OnInit } from "@angular/core";
import { OrderType, Measure, TableVersion } from "../../_enums/enums.enum";
import { OrdersService } from "../../_services/orders.service";
import { Router } from "@angular/router";
import { SqlFilterQueryBuilderComponent } from "../../common/sql-filter-query-builder/sql-filter-query-builder.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import { Definition } from "../definition";
import { AuthenticationService } from "../../_services/authentication.service";
import { Angular2Csv } from "angular2-csv";

@Component({
  selector: "app-crosstab-definition",
  templateUrl: "./crosstab-definition.component.html",
  styleUrls: ["./crosstab-definition.component.css"],
  host: {
    "(document:click)": "closeDropdown($event)",
  },
})
export class CrosstabDefinitionComponent implements OnInit {
  public OrderType = OrderType;
  public Measure = Measure;
  public TableVersion = TableVersion;

  public definitionName: string = "";
  public selectedOrderType: OrderType = OrderType.PPM;
  public selectedTableVersion: TableVersion = TableVersion.Staging;
  public selectedOrder: any;
  public selectedMeasure: Measure;
  public selectedRows = [];
  public selectedColumns = [];
  public selectedValues = [];
  public searchVariable: string;
  public searchOrder: string;
  public filteredOrders = [];
  public orderVariables = [];
  public gridData = {
    data: [],
    columnconfig: [],
    // events: {
    //   rowClicked: this.gridRowClicked.bind(this)
    // },
    settings: {
      search: true,
    },
  };
  public selectedValueError: boolean = false;
  public definitionNameEmpty: boolean = false;
  public SelectedRowsEmpty: boolean = false;
  public selectedValueEmpty: boolean = false;
  public selectedMeasureEmpty: boolean = false;
  public selectedOrderEmpty: boolean = false;
  public showCrosstabTable: boolean = false;
  public responseMessage: string = "";
  public response: boolean = false;
  public error: boolean = false;

  private totalOrders = [];
  private filterString = "";
  private group = {
    rules: [{ operator: "&&", rules: [] }],
  };
  private openedDropdown = {
    type: "",
    index: null,
  };

  constructor(
    private orderService: OrdersService,
    private router: Router,
    private modalService: NgbModal,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.getOrders();
    this.getOrderVariables(OrderType.PPM);
  }

  private getOrders(): void {
    this.orderService.GetOrders("").subscribe(
      (res) => {
        this.totalOrders = res;
        this.getFilteredOrders(OrderType.PPM);
      },
      (err) => {}
    );
  }

  private getSelectedItemDBName(itemsArray: any[]): any[] {
    let dbName = [];

    for (let item in itemsArray) {
      let initialDBName = itemsArray[item].DBColumnName;
      let transformedDBName = "";

      transformedDBName = initialDBName.slice(1, initialDBName.length - 1);

      dbName.push(transformedDBName);
    }

    return dbName;
  }

  private populateGrid(response: any[]) {
    let columnconfig = [];
    let gridColumns = [];
    let DBName = [];

    //reset all variables of GridObject
    this.resetGrid();

    if (response.length > 0) {
      this.gridData.data = response;
    }

    //Get all the column names from the response
    for (let data in this.gridData.data[0]) {
      gridColumns.push(data);
    }

    //Get DbName of all selected rows;
    DBName = this.getSelectedItemDBName(this.selectedRows);

    //To filter out the name of the rows from the received grid columns
    for (let i = 0; i < DBName.length; i++) {
      gridColumns = gridColumns.filter((x) => x !== DBName[i]);
    }

    //Manually pushing the name of rows in column config
    for (let row in this.selectedRows) {
      let columnData = {
        prop: "",
        as: "",
      };

      columnData.prop = this.selectedRows[row].DBColumnName.slice(
        1,
        this.selectedRows[row].DBColumnName.length - 1
      );
      columnData.as = this.selectedRows[row].DisplayName;

      columnconfig.push(columnData);
    }

    for (let i = 0; i < gridColumns.length; i++) {
      let column = {
        prop: "",
        as: "",
      };

      column.prop = gridColumns[i];
      column.as = gridColumns[i];

      columnconfig.push(column);
    }

    this.gridData.columnconfig = columnconfig;
  }

  private resetGrid() {
    this.gridData.data = [];
  }

  // private getTransformedVariables(orderVariables: any[]): any {
  //   let transformedOrderVariables = [];
  //   let transformedOrderVariable = {
  //     name: "",
  //     column: "",
  //     type: "",
  //   };

  //   orderVariables.forEach((variable) => {
  //     transformedOrderVariable.name = variable["DisplayName"];
  //     transformedOrderVariable.column = variable["DisplayName"];

  //     switch (variable["DataType"]) {
  //       case "nvarchar(MAX)":
  //       case "nvarchar (450)":
  //       case "char":
  //         transformedOrderVariable.type = "string";
  //         break;

  //       case "datetime":
  //         transformedOrderVariable.type = "date";
  //         break;

  //       case "int":
  //       case "decimal":
  //         transformedOrderVariable.type = "number";
  //         break;

  //       default:
  //         console.log(variable);
  //     }

  //     transformedOrderVariables.push(
  //       JSON.parse(JSON.stringify(transformedOrderVariable))
  //     );
  //   });

  //   return transformedOrderVariables;
  // }

  getFilterFields(orderVariables: any[]): any[] {
    let fields = [];
    for (var i = 0; i < orderVariables.length; i++) {
      let field = {};
      field["name"] = orderVariables[i]["DisplayName"];
      field["column"] = orderVariables[i]["DisplayName"];
      field["type"] = "string";
      fields.push(field);
    }
    return fields;
  }

  private validateSelectedItems(): boolean {
    let order = false;
    let value = false;
    let row = false;
    let measure = false;

    if (this.selectedOrder === null || this.selectedOrder === undefined) {
      this.selectedOrderEmpty = true;
      order = true;
    }

    if (this.selectedValues.length === 0) {
      this.selectedValueEmpty = true;
      value = true;
    }

    if (this.selectedRows.length === 0) {
      this.SelectedRowsEmpty = true;
      row = true;
    }

    if (this.selectedMeasure === null || this.selectedMeasure === undefined) {
      this.selectedMeasureEmpty = true;
      measure = true;
    }

    if (order || value || row || measure) {
      return false;
    } else return true;
  }

  private getSelectedItemsString(items: any): string {
    let selectedItems = [];

    items.forEach((element: any) => {
      selectedItems.push(element.DBColumnName);
    });

    let selectedItemsString = selectedItems.join(",");

    return selectedItemsString;
  }

  private populateCrosstabDefinition(): Definition {
    let definition = new Definition();

    definition.Columns = this.getSelectedItemsString(this.selectedColumns);
    definition.Rows = this.getSelectedItemsString(this.selectedRows);
    definition.Filter = this.filterString;
    definition.Measure = this.selectedMeasure;
    definition.Value = this.selectedValues[0].DBColumnName;
    definition.TableVersion = this.selectedTableVersion;
    definition.Name = this.definitionName;
    definition.OrderType = this.selectedOrder.OrderType;
    definition.OrderCode = this.selectedOrder.OrderCode;
    definition.CreatedBy = this.authenticationService.GetCurrentUserInfo().username;

    return definition;
  }

  private checkSelectedArray(containerType: string, value: any): boolean {
    if (containerType === "rows") {
      var index = this.selectedRows.findIndex(
        (x) => x.DisplayName.trim() === value.DisplayName.trim()
      );
    }

    if (containerType === "columns") {
      var index = this.selectedColumns.findIndex(
        (x) => x.DisplayName.trim() === value.DisplayName.trim()
      );
    }

    if (containerType === "value") {
      var index = this.selectedValues.findIndex(
        (x) => x.DisplayName.trim() === value.DisplayName.trim()
      );
    }

    if (index === -1) {
      return true;
    } else return false;
  }

  private getTransformedGridData(gridData: any[]): any[] {
    let transformedGridData = [];

    let tableHeaders = [];
    gridData.forEach((data) => {
      let rowData = [];
      for (let key in data) {
        for (let i = 0; i < this.selectedRows.length; i++) {
          let displayName = this.selectedRows[i].DisplayName;
          let dbName = this.selectedRows[i].DBColumnName;
          let transformedDbName = dbName.slice(1, dbName.length - 1);

          if (key === transformedDbName) {
            if (transformedGridData.length == 0) {
              tableHeaders.unshift(displayName);
            }
            rowData.unshift(data[key]);
          } else {
            if (transformedGridData.length == 0) {
              tableHeaders.push(key);
            }
            rowData.push(data[key]);
          }
        }
      }
      if (transformedGridData.length == 0) {
        transformedGridData.push(tableHeaders);
      }
      transformedGridData.push(rowData);
    });

    return transformedGridData;
  }

  private clearOpenedDropdownData() {
    this.openedDropdown.index = null;
    this.openedDropdown.type = "";
  }

  private addMeasureProperty() {
    this.orderVariables.forEach((variable) => {
      switch (variable["DataType"]) {
        case "int":
        case "decimal":
          variable.isNumeric = true;
          break;
      }
    });
  }

  public getOrderVariables(orderType: any): void {
    this.orderService.GetStructure(orderType).subscribe((res) => {
      this.orderVariables = res;
      this.orderVariables.map((x) => (x.isNumeric = false));
      this.addMeasureProperty();
    });
  }

  public getFilteredOrders(orderType: any): void {
    let requiredOrderType = parseInt(orderType);
    this.filteredOrders = this.totalOrders.filter(
      (x) => x.OrderType === requiredOrderType
    );
  }

  public allowDrop(event: any): void {
    event.preventDefault();
  }

  public onDrag(event: any, variable: any): void {
    event.dataTransfer.setData("variable", JSON.stringify(variable));
  }

  public onDropRowContainer(event: any): void {
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData("variable"));
    data.isToggle = false;
    if (
      this.checkSelectedArray("rows", data) &&
      this.checkSelectedArray("value", data)
    ) {
      this.selectedRows.push(data);
      this.SelectedRowsEmpty = false;
    } else {
      alert(
        "Unable to perform this action!! \n(Either the variable is already present in this container or selected as a Value variable.)"
      );
    }
  }

  public onDropColumnContainer(event: any): void {
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData("variable"));
    data.isToggle = false;
    if (
      (this.checkSelectedArray("columns", data),
      this.checkSelectedArray("value", data))
    ) {
      this.selectedColumns.push(data);
    } else {
      alert(
        "Unable to perform this action!! \n(Either the variable is already present in this container or selected as a Value variable.)"
      );
    }
  }

  public onDropValueContainer(event: any): void {
    event.preventDefault();
    var data = JSON.parse(event.dataTransfer.getData("variable"));
    data.selectedMeasure = "(Count)";
    this.selectedMeasure = Measure["Count"];
    if (this.selectedValues.length >= 1) {
      this.selectedValueError = true;
    } else {
      if (
        this.checkSelectedArray("rows", data) &&
        this.checkSelectedArray("columns", data)
      ) {
        data.isToggle = false;
        this.selectedValues.push(data);
        this.selectedValueError = false;
        this.selectedValueEmpty = false;
      } else {
        alert("This variable is already selected as a row/column variable.");
      }
    }
  }

  public removeSelectedItem(containerType: string, index: number): void {
    switch (containerType) {
      case "column":
        this.selectedColumns.splice(index, 1);
        this.clearOpenedDropdownData();
        break;

      case "row":
        this.selectedRows.splice(index, 1);
        this.clearOpenedDropdownData();
        break;

      case "value":
        this.selectedValues.splice(index, 1);
        this.clearOpenedDropdownData();
        break;
    }
  }

  public runCrosstab(): void {
    if (this.validateSelectedItems()) {
      this.clearError("all");
      let defintion = this.populateCrosstabDefinition();
      this.orderService.RunCrossTabDefinition(defintion).subscribe(
        (res: any[]) => {
          this.showCrosstabTable = true;
          this.populateGrid(res);
        },
        (err) => {
          this.showCrosstabTable = false;
          alert("There was some error!!");
        }
      );
    }
  }

  public saveCrosstab(): void {
    if (this.definitionName.trim() === "") {
      this.definitionNameEmpty = true;
      return;
    }
    if (this.validateSelectedItems()) {
      this.clearError("all");
      let defintion = this.populateCrosstabDefinition();
      this.orderService.SaveCrossTabDefinition(defintion).subscribe(
        (res: any[]) => {
          this.response = true;
          this.error = false;
          this.responseMessage = "Definition saved successfully.";
        },
        (err) => {
          this.response = false;
          this.error = true;
          this.responseMessage = "Definition save failed.";
        }
      );
    }
  }

  public openDropDown(item: any, index: number, type: string) {
    if (this.openedDropdown.index == null) {
      item.isToggle = !item.isToggle;
      this.openedDropdown.index = index;
      this.openedDropdown.type = type;
    } else {
      let variableArray;
      switch (this.openedDropdown.type) {
        case "row":
          variableArray = this.selectedRows;
          break;

        case "column":
          variableArray = this.selectedColumns;
          break;

        case "value":
          variableArray = this.selectedValues;
          break;
      }

      variableArray[this.openedDropdown.index].isToggle = false;
      if (
        this.openedDropdown.index !== index ||
        this.openedDropdown.type !== type
      ) {
        item.isToggle = !item.isToggle;
        this.openedDropdown.index = index;
        this.openedDropdown.type = type;
      } else {
        this.clearOpenedDropdownData();
      }
    }
  }

  public closeDropdown($event: any) {
    if (this.openedDropdown.index !== null) {
      let variableArray;
      switch (this.openedDropdown.type) {
        case "row":
          variableArray = this.selectedRows;
          break;

        case "column":
          variableArray = this.selectedColumns;
          break;

        case "value":
          variableArray = this.selectedValues;
          break;
      }

      variableArray[this.openedDropdown.index].isToggle = false;
      this.clearOpenedDropdownData();
    }
  }

  public ShowFilterPopup(event) {
    const modalRef = this.modalService.open(SqlFilterQueryBuilderComponent);
    modalRef.componentInstance.fields = this.getFilterFields(
      this.orderVariables
    );
    modalRef.componentInstance.group = this.group;

    modalRef.result.then((result) => {
      this.group = result.group;
      this.filterString = JSON.parse(result.condition);
    });
  }

  public clearSelection(type: string) {
    switch (type) {
      case "row":
        this.selectedRows = [];
        this.clearOpenedDropdownData();
        break;
      case "column":
        this.selectedColumns = [];
        this.clearOpenedDropdownData();
        break;
      case "value":
        this.selectedValues = [];
        this.selectedMeasure = null;
        this.clearOpenedDropdownData();
        break;
    }
  }

  public moveVariable(containerType: string, index: number) {
    let data: any;
    switch (containerType) {
      case "row":
        data = this.selectedRows[index];
        if (this.checkSelectedArray("columns", data)) {
          this.selectedColumns.push(...this.selectedRows.splice(index, 1));
          this.selectedColumns[
            this.selectedColumns.length - 1
          ].isToggle = false;
          this.clearOpenedDropdownData();
        } else {
          alert("already exists");
          this.selectedRows[index].isToggle = false;
        }
        break;
      case "column":
        data = this.selectedColumns[index];
        if (this.checkSelectedArray("rows", data)) {
          this.selectedRows.push(...this.selectedColumns.splice(index, 1));
          this.selectedRows[this.selectedRows.length - 1].isToggle = false;
          this.clearOpenedDropdownData();
        } else {
          alert("already exists");
          this.selectedColumns[index].isToggle = false;
        }
        break;
    }
  }

  public selectMeasure(value: Measure) {
    this.selectedMeasure = value;
    this.selectedValues[0].isToggle = false;
    this.selectedValues[0].selectedMeasure = `(${Measure[value]})`;
    this.selectedMeasureEmpty = false;
  }

  public clearError(type: string) {
    if (type === "order") {
      this.selectedOrderEmpty = false;
    } else {
      this.selectedOrderEmpty = false;
      this.selectedValueEmpty = false;
      this.definitionNameEmpty = false;
      this.selectedValueError = false;
      this.SelectedRowsEmpty = false;
      this.selectedMeasureEmpty = false;
    }
  }

  public downloadGridData(): void {
    let gridData = JSON.parse(JSON.stringify(this.gridData.data));
    let transformedData = this.getTransformedGridData(gridData);

    new Angular2Csv(transformedData, "Report");
  }
}
