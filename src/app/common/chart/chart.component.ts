import { Component, AfterViewInit, OnDestroy, NgZone, Input } from '@angular/core';
import { Chart } from "../../_models/models";
declare var zingchart: any;
@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
  inputs: ['chart']

})
export class ChartComponent implements AfterViewInit, OnDestroy {
  chart: Chart;
  constructor(private zone: NgZone) { }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      zingchart.render(this.chart);
    });
  }
  ngOnDestroy() {
    zingchart.exec(this.chart['id'], 'destroy');
  }

}
