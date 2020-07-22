import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { OrdersService } from "../_services/orders.service";
import { OrderType } from "../_enums/enums.enum";
import { HttpClient } from "@angular/common/http";
import { DataTableTemplates } from "../_enums/data-table-templates.enum";
import { SqlFilterQueryBuilderComponent } from "../common/sql-filter-query-builder/sql-filter-query-builder.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Definition } from "./definition";
import { Angular2Csv } from "angular2-csv";

@Component({
  selector: "app-cross-tab",
  templateUrl: "./cross-tab.component.html",
  styleUrls: ["./cross-tab.component.css"],
})
export class CrossTabComponent implements OnInit {
  public OrderType = OrderType;

  public filteredOrders = [];
  public searchOrder: string;
  public searchDefinition: string;
  public selectedOrder: any;
  public selectedDefinition: any;
  public crosstabDefinitions: any;
  public gridData = {
    data: [],
    columnconfig: [],
    settings: {
      search: true,
    },
  };
  public selectedDefinitionEmpty: boolean = false;
  public selectedOrderEmpty: boolean = false;
  public showCrosstabTable: boolean = false;
  public orderVariables = [];

  private totalOrders = [];
  private group = {
    rules: [{ operator: "&&", rules: [] }],
  };
  private filterString = "";

  constructor(
    public router: Router,
    private orderService: OrdersService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getOrders();
    this.getDefinitions();
    this.getOrderVariables(OrderType.PPM);
  }

  private getDefinitions() {
    this.orderService.GetCrossTabDefinition().subscribe((res) => {
      this.crosstabDefinitions = res;
      this.crosstabPropertiesTransformation();
    });
  }

  private crosstabPropertiesTransformation(): void {
    this.crosstabDefinitions.forEach((definition) => {
      let createdOndate = new Date(definition.CreatedOn).toLocaleDateString();
      definition.CreatedOn = createdOndate;
    });
  }

  private getOrders(): void {
    this.orderService.GetOrders("").subscribe(
      (res) => {
        this.totalOrders = res;
        this.filteredOrders = res;
      },
      (err) => {}
    );
  }

  private getSelectedRowsVariables(): any[] {
    let rows = this.selectedDefinition.Rows.split(",");
    let rowVariables = [];
    for (let i = 0; i < rows.length; i++) {
      rowVariables.push(
        ...this.orderVariables.filter((x) => x.DBColumnName === rows[i])
      );
    }

    return rowVariables;
  }

  private populateGrid(response: any) {
    let columnconfig = [];
    let gridColumns = [];
    let rowVariables = [];

    //reset all variables of GridObject
    this.resetGrid();

    if (response.length > 0) {
      this.gridData.data = response;
    }

    rowVariables = this.getSelectedRowsVariables();

    for (let data in this.gridData.data[0]) {
      gridColumns.push(data);
    }

    for (let i = 0; i < rowVariables.length; i++) {
      let columnData = {
        prop: "",
        as: "",
      };

      let variable = rowVariables[i].DBColumnName;

      gridColumns = gridColumns.filter(
        (x) => x !== variable.slice(1, variable.length - 1)
      );

      columnData.prop = variable.slice(1, variable.length - 1);
      columnData.as = rowVariables[i].DisplayName;

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

  private validateSelectedItems(): boolean {
    let definition = false;
    let order = false;

    if (
      this.selectedDefinition === null ||
      this.selectedDefinition === undefined
    ) {
      this.selectedDefinitionEmpty = true;
      definition = true;
    }

    if (this.selectedOrder === null || this.selectedOrder === undefined) {
      this.selectedOrderEmpty = true;
      order = true;
    }

    if (definition || order) {
      return false;
    } else return true;
  }

  private getFilteredOrders(orderType: any): void {
    let requiredOrderType = parseInt(orderType);
    this.filteredOrders = this.totalOrders.filter(
      (x) => x.OrderType === requiredOrderType
    );
  }

  private getOrderVariables(orderType: any): void {
    this.orderService.GetStructure(orderType).subscribe((res) => {
      this.orderVariables = res;
    });
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
  //         transformedOrderVariable.type = "string";
  //         break;

  //       case "datetime":
  //         transformedOrderVariable.type = "date";
  //         break;

  //       case "int":
  //       case "decimal":
  //         transformedOrderVariable.type = "number";
  //         break;
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

  private populateCrosstabDefinition(): Definition {
    let definition = new Definition();

    definition.Columns = this.selectedDefinition.Columns;
    definition.Rows = this.selectedDefinition.Rows;
    definition.Filter =
      this.filterString.trim() === ""
        ? this.selectedDefinition.Filter
        : this.filterString;
    definition.Measure = this.selectedDefinition.Measure;
    definition.Value = this.selectedDefinition.Value;
    definition.TableVersion = this.selectedDefinition.TableVersion;
    definition.Name = this.selectedDefinition.Name;
    definition.OrderType = this.selectedOrder.OrderType;
    definition.OrderCode = this.selectedOrder.OrderCode;

    return definition;
  }

  private getTransformedGridData(gridData: any[]): any[] {
    let transformedGridData = [];
    let tableHeaders = [];
    let rowVariables = this.getSelectedRowsVariables();
    gridData.forEach((data) => {
      let rowData = [];
      for (let key in data) {
        for (let i = 0; i < rowVariables.length; i++) {
          let displayName = rowVariables[i].DisplayName;
          let dbName = rowVariables[i].DBColumnName;
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

  public deleteDefinition(id: number, index: number) {
    let confirmation = confirm(
      "Are you sure you want to delete this definition.?"
    );
    if (confirmation) {
      this.orderService.DeleteCrossTabDefinition(id).subscribe((res) => {
        this.crosstabDefinitions.splice(index, 1);
      });
    }
  }

  public runCrosstab(): void {
    if (this.validateSelectedItems()) {
      let definition = this.populateCrosstabDefinition();
      this.orderService.RunCrossTabDefinition(definition).subscribe(
        (res: any[]) => {
          this.showCrosstabTable = true;
          this.populateGrid(res);
        },
        (err) => {
          this.showCrosstabTable = false;
          alert("There was an Error!!");
        }
      );
    }
  }

  public itemSelected(category: string, orderType: number) {
    if (category == "definition") {
      this.selectedDefinitionEmpty = false;
      this.selectedOrder = null;
      this.getFilteredOrders(orderType);
      this.getOrderVariables(orderType);
    } else {
      this.selectedOrderEmpty = false;
    }
  }

  public downloadGridData() {
    let gridData = JSON.parse(JSON.stringify(this.gridData.data));
    let transformedData = this.getTransformedGridData(gridData);

    new Angular2Csv(transformedData, "Report");
  }
}
