import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-query-builder-script',
  templateUrl: './query-builder-script.component.html',
  styleUrls: ['./query-builder-script.component.css']
})
export class QueryBuilderScriptComponent implements OnInit {
  @Input()
  group;
  @Output() groupChange: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  parent;
  @Input()
  index;
  @Input()
  fields;
  @Input()
  conditiondisplay;

  vm = this;


  operators = [
    { name: 'AND', value: '&&' },
    { name: 'OR', value: '||' }
  ];

  conditions = {
    'string': [{
      name: 'Exactly matches',
      value: 'TextEqualTo',
      dataControlType: 1
    },
    {
      name: 'Does NOT match',
      value: 'TextNotEqualTo',
      dataControlType: 1
    },
    {
      name: 'Contains the following text',
      value: 'TextContains',
      dataControlType: 1
    },
    {
      name: 'Does NOT contain the following text',
      value: 'TextDoesNotContain',
      dataControlType: 1
    },
    {
      name: 'Contain Any of the following text',
      value: 'TextContainsAny',
      dataControlType: 1
    }
    ],
    'number': [{
      name: 'Equal to (=)',
      value: 'NumberEqualTo',
      dataControlType: 2
    },
    {
      name: 'NOT Equal to (!=)',
      value: 'NumberNotEqualTo',
      dataControlType: 2
    },
    {
      name: 'Greater than (>)',
      value: 'NumberGreaterThan',
      dataControlType: 2
    },
    {
      name: 'Less than (<)',
      value: 'NumberLessThan',
      dataControlType: 2
    },
    {
      name: 'Greater than or equal to (>=)',
      value: 'NumberGreaterThanOrEqualTo',
      dataControlType: 2
    },
    {
      name: 'Less than or equal to (<=)',
      value: 'NumberLessThanOrEqualTo',
      dataControlType: 2
    },
    {
      name: 'Contain Any Of the following numbers',
      value: 'NumberContainsAny',
      dataControlType: 2
    }
    ],
    'singlechoice': [{
      name: 'Selected item Is',
      value: 'ItemSelected',
      dataControlType: 3
    },
    {
      name: 'Unselected item Is',
      value: 'ItemNotSelected',
      dataControlType: 3
    },
      // {
      //   name: 'Any of the following items were selected',
      //   value: 'AnyItemSelected',
      //   dataControlType: 4
      // }
    ],
    'multiplechoice': [{
      name: 'Selected item Is',
      value: 'ItemSelected',
      dataControlType: 3
    },
    {
      name: 'Unselected item Is',
      value: 'ItemNotSelected',
      dataControlType: 3
    },
      // {
      //   name: 'Any of the following items were selected',
      //   value: 'AnyItemSelected',
      //   dataControlType: 4
      // },
      // {
      //   name: 'All of the following items were selected',
      //   value: 'AllItemsSelected',
      //   dataControlType: 4
      // }
    ],
    "date": [{
      name: 'Selected date is',
      value: 'DateSelected',
      dataControlType: 5
    }, {
      name: 'After Date (>)',
      value: 'DateAfter',
      dataControlType: 5
    }, {
      name: 'Before Date (<)',
      value: 'DateBefore',
      dataControlType: 5
    }]
  }

  constructor() { }

  ngOnInit() {
    if (!this.conditiondisplay) {
      const condition1 = {
        name: 'Is Null',
        value: 'IsNull',
        dataControlType: 0
      }
      const condition2 = {
        name: 'Is Not Null',
        value: 'IsNotNull',
        dataControlType: 0
      }
      this.conditions['string'].push(condition1);
      this.conditions['string'].push(condition2);
    }
  }

  addCondition() {
    this.group.rules.push({
      condition: '',
      field: '',
      data: '',
      type: ''
    });
  }

  addGroup() {
    this.group.rules.push({
      group: {
        operator: '&&',
        rules: []
      }
    });
  }

  removeGroup() {
    "group" in this.parent && this.parent.group.rules.splice(this.index, 1);
  }
  removeCondition(index) {
    this.group.rules.splice(index, 1);
  }

  changeConditions(newVal, rule) {
    let selectedField = this.fields.filter(f => f['column'] == newVal);
    rule.type = selectedField[0].type;
    rule.condition = '';
    rule.dataControlType = '';
    rule.SelectedField = selectedField[0];
  }
  changeControlType(newVal, rule) {
    let selectedCondition = this.conditions[rule.type].filter(f => f['value'] == newVal);
    rule.dataControlType = selectedCondition[0].dataControlType;
  }

}
