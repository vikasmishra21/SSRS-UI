import { Component, OnInit } from '@angular/core';
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import { OrdersService } from "../../_services/orders.service";

@Component({
  selector: 'app-cleaning-rules',
  templateUrl: './cleaning-rules.component.html',
  styleUrls: ['./cleaning-rules.component.css']
})
export class CleaningRulesComponent implements OnInit {
  gridData = {
    data: [],
    columnconfig: [
      { prop: 'Name', as: 'Rule Name' },
      { prop: 'Filename', as: 'FILE NAME' },
      { prop: 'delete', as: 'Delete', cellTemplate: DataTableTemplates.Delete }],
    events: {
      rowClicked: this.gridRowClicked.bind(this)
    },
    models: { search: '' }
  };
  formData = {
    name: '', fileName: ''
  }

  constructor(private ordersService: OrdersService) { }

  ngOnInit() {
    this.getGridData();
  }

  getGridData() {
    this.ordersService.GetCleaningRules().subscribe(
      response => this.populateGrid(response),
      error => console.log(error)
    )
  }

  resetGrid() {
    this.gridData.data = [];
  }

  populateGrid(response: any[]) {
    //reset all variables of GridObject
    this.resetGrid();
    if (response.length > 0) {
      this.gridData.data = response;
    }
  }

  gridRowClicked(ev, row, column) {
    if (column.prop == "delete") {
      var confirmation = confirm("Are you Sure want to delete this row?");
      if (confirmation) {
        this.deleteRule(row['ID']);
      }
    }
  }

  deleteRule(id: number) {
    this.ordersService.DeleteCleaningRule(id).subscribe(
      response => this.getGridData(),
      error => console.log(error)
    )
  }

  Submit() {
    let validated = this.validate();
    if (validated) {
      let rule = this.ordersService.CreateNewCleaningRule(this.formData.name, this.formData.fileName);

      this.ordersService.SaveCleaningRule(rule).subscribe(
        response => this.getGridData(),
        error => console.log(error)
      );
    }
    else {
      alert('Please fill all the fields to Add this Rule.');
    }
  }

  validate(): boolean {
    if (!this.formData.name) {
      return false;
    }
    if (!this.formData.fileName) {
      return false;
    }
    return true;
  }
}
