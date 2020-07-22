import { Component, OnInit, Input } from '@angular/core';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as _ from 'underscore';
@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
  @Input()
  data;
  @Input()
  columnconfig;
  @Input()
  events;
  @Input()
  settings;

  search: string = ''

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    if (!this.settings)
      this.settings = {};
    if (this.settings.srNo == undefined)
      this.settings.srNo = false;
    if (!this.settings.currentPage)
      this.settings.currentPage = 1;
  }

  cellClicked($event, row, column) {
    if (this.events.rowClicked) {
      this.events.rowClicked($event, row, column);
    }
  }
  DownloadCSV() {
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      // headers: _.pluck(this.columnconfig, 'as')
    };
    if (this.data.length > 0) {
      options["headers"] = Object.keys(this.data[0]);
    }
    new Angular2Csv(this.data, 'Report', options);
  }

  pageChanged(pageNumber) {
    this.settings.currentPage = pageNumber;
    if (this.events.onCurrentPageChange)
      this.events.onCurrentPageChange(this.settings.currentPage);
  }


}
