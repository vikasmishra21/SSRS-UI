import { Component, OnInit } from '@angular/core';
import { DataTableTemplates } from "../../_enums/data-table-templates.enum";
import { OrdersService } from "../../_services/orders.service";

@Component({
  selector: 'app-incentive-rules',
  templateUrl: './incentive-rules.component.html',
  styleUrls: ['./incentive-rules.component.css']
})
export class IncentiveRulesComponent implements OnInit {
  vm = this;
  orderType: any[] = [{ code: 1, name: 'Diary' }, { code: 2, name: 'PPM' }, { code: 3, name: 'PR' }];
  gridData = {
    data: [],
    columnconfig: [
      { prop: 'Name', as: 'Rule Name' },
      { prop: 'Rule', as: 'Condition' },
      { prop: 'delete', as: 'Delete', cellTemplate: DataTableTemplates.Delete }],
    events: {
      rowClicked: this.gridRowClicked.bind(this)
    },
    models: { search: '' }
  };

  formData = {
    name: '',
    rule: '',
    ruleType: '1',
    orderType: '1'
  }

  group = {
    rules: []
  }

  fields = [];


  constructor(private ordersService: OrdersService) {
  }

  ngOnInit() {
    this.getFields();
    this.getGridData();
  }

  getGridData() {
    this.ordersService.GetIncentiveRules(this.formData.orderType).subscribe(
      response => this.populateGrid(response),
      error => console.log(error)
    )
  }

  deleteRule(id: number) {
    this.ordersService.DeleteIncentiveRule(id).subscribe(
      response => this.getGridData(),
      error => console.log(error)
    )
  }


  populateGrid(response: any[]) {
    //reset all variables of GridObject
    this.gridData.data = [];
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

  getFields() {
    if (this.formData.orderType != "")
      this.ordersService.GetFilterVariablesForIncentive(this.formData.orderType).subscribe(
        response => { this.fields = response; this.group.rules = []; },
        error => console.log(error)
      ); else
      alert('please choose orderType..');
  }

  AddGroup() {
    this.group.rules.push({ "operator": "&&", "rules": [], "amount": '' });
  }

  htmlEntities(str) {
    return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  computed(group) {
    if (!group) return "";

    for (var str = "", i = 0; i < group.rules.length; i++) {
      i > 0 && (str += " " + group.operator + " ");
      str += group.rules[i].group ?
        this.computed(group.rules[i].group) :
        group.rules[i].field + " " + this.htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
    }

    return str;
  }

  Submit() {
    let str = [];
    if (this.formData.ruleType == '2') {
      for (var dataIndex = 0; dataIndex < this.group.rules.length; dataIndex++) {
        var queryStr = this.computed(this.group.rules[dataIndex]);
        queryStr += ' :: Value : ' + this.group.rules[dataIndex].amount;
        str.push(queryStr);
      }

      this.formData.rule = str.join(' + ');
    }
    let validated = this.validate();
    if (validated) {
      let rule = this.ordersService.CreateNewIncentiveRule(this.formData.name, this.formData.rule, this.formData.orderType);

      this.ordersService.SaveIncentiveRule(rule).subscribe(
        response => {
          this.ChangeRuleType();
          this.getGridData();
        },
        error => console.log(error)
      );
    }
    else {
      alert('Please fill all the fields to Add this Rule.');
    }
  }

  ChangeRuleType() {
    this.group = {
      rules: []
    }
    this.formData.rule = '';
    this.formData.name = '';
  }

  ChangeFieldVariables(event) {
    this.formData.orderType = event;
    this.getFields();
    this.getGridData();
  }

  validate(): boolean {
    if (!this.formData.name) {
      return false;
    }
    if (!this.formData.rule) {
      return false;
    }
    return true;
  }
}
