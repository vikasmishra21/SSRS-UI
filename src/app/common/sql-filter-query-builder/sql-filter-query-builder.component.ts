import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-sql-filter-query-builder',
  templateUrl: './sql-filter-query-builder.component.html',
  styleUrls: ['./sql-filter-query-builder.component.css']
})
export class SqlFilterQueryBuilderComponent implements OnInit {
  @Input() fields;
  vm = this;
  whereCondition = '';

  @Input()
  group;

  DateTimeGroup = ['ReceiptDate', 'FinalizeDate', 'InitialMailSentOn', 'Reminder1SentOn', 'Reminder2SentOn', 'InitialPOReturnOn', 'Reminder1POReturnOn',
    'Reminder2POReturnOn', 'CreatedOn', 'ModifiedOn', 'PulledOn', 'PoProblemReportedOnInitial', 'PoProblemReportedOnReminder1', 'PoProblemReportedOnReminder2', 'PromisedIncentivePaidOn'];

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {

  }

  condition(rule) {
    if (!rule || !rule.field || !rule.condition) return "";
    else if (rule.condition != 'IsNull' && rule.condition != 'IsNotNull') {
      if (!rule.data)
        return "";
    }
    let condition: string = "";

    switch (rule.condition) {
      case "TextEqualTo":
        condition = rule.field + " = '" + rule.data + "'";
        break;
      case "TextNotEqualTo":
        condition = rule.field + " <> '" + rule.data + "'";
        break;
      case "TextContains":
        if (this.DateTimeGroup.indexOf(rule.field) != -1)
          condition = "convert(varchar(max), " + rule.field + ", 126) like '%" + rule.data + "%'";
        else
          condition = rule.field + " like '%" + rule.data + "%'";
        break;
      case "TextDoesNotContain":
        if (this.DateTimeGroup.indexOf(rule.field) != -1)
          condition = "convert(varchar(max), " + rule.field + ", 126) not like '%" + rule.data + "%'";
        else
          condition = rule.field + " not like '%" + rule.data + "%'";
        break;
      case "NumberEqualTo":
        condition = rule.field + " = " + rule.data;
        break;
      case "NumberGreaterThan":
        condition = rule.field + " > " + rule.data;
        break;
      case "NumberLessThan":
        condition = rule.field + " < " + rule.data;
        break;
      case "NumberGreaterThanOrEqualTo":
        condition = rule.field + " >= " + rule.data;
        break;
      case "NumberLessThanOrEqualTo":
        condition = rule.field + " <= " + rule.data;
        break;
      case "ItemSelected":
        condition = rule.field + " = '" + rule.data + "'";
        break;

      case "ItemNotSelected":
        condition = rule.field + " <> '" + rule.data + "'";
        break;
      case "AnyItemSelected":
        condition = rule.field + " in (" + rule.data + ")";
        break;
      case "AllItemsSelected":
        condition = rule.field + " is not null";
        break;
      case "DateSelected":
        condition = rule.field + " = " + new Date(rule.data.year, rule.data.month, rule.data.day).toISOString();
        break;
      case "DateAfter":
        condition = rule.field + " > " + new Date(rule.data.year, rule.data.month, rule.data.day).toISOString();
        break;
      case "DateBefore":
        condition = rule.field + " <" + new Date(rule.data.year, rule.data.month, rule.data.day).toISOString();
        break;
      case "IsNull":
        condition = rule.field + " is null";
        break;
      case "IsNotNull":
        condition = rule.field + " is not null";
        break;
    }
    return condition;
  }

  compute(gp) {
    if (!gp) return "";
    for (var str = "", i = 0; i < gp.rules.length; i++) {
      //if ((gp.rules[i].condition != 'IsNull' && gp.rules[i].condition != 'IsNotNull') && gp.rules[i].data) {
      i > 0 && (str += gp.operator == "&&" ? ' AND ' : ' OR ');
      str += gp.rules[i].group ? this.compute(gp.rules[i].group) : this.condition(gp.rules[i]);
      //}
    }

    return str;
  }

  BuidSqlCondition() {
    this.whereCondition = '';

    for (var ruleIndex in this.group.rules) {
      this.whereCondition += this.compute(this.group.rules[ruleIndex]);
    }

    return this.whereCondition;
  }

  ApplyFilters() {
    this.activeModal.close({ condition: JSON.stringify(this.whereCondition), group: this.group });
  }


}
