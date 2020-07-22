import { Component, OnInit } from '@angular/core';
import { PoReturnsService } from "../../_services/po-returns.service";
import { Router, RouterModule } from '@angular/router';
import { BarCodeInfo } from "../../_models/models";

@Component({
  selector: 'app-summary-window',
  templateUrl: './summary-window.component.html',
  styleUrls: ['./summary-window.component.css']
})
export class SummaryWindowComponent implements OnInit {

  RunningSummary: any[];
  Bin: any[];
  interval: string = '1000'
  constructor(private poReturnsService: PoReturnsService,
    private router: Router) {

  }

  ngOnInit() {
    this.poReturnsService.UpdateSummaryWindowEmmiter.subscribe(res => {
      this.UpdateGrids();
    });
    this.UpdateGrids();
  }

  UpdateGrids() {
    this.RunningSummary = JSON.parse(localStorage.getItem('runningSummaryList')) || [];
    this.RunningSummary = this.RunningSummary.reverse();
    this.Bin = JSON.parse(localStorage.getItem('bin')) || [];
    this.interval = this.poReturnsService.GetDetailTimeInterval();
  }
  GetImage(binRow) {
    if(!binRow.isShred)
      return this.poReturnsService.GetBinImage(binRow.currency);
    else
      return this.poReturnsService.GetShredImage();

  }

  ChangeInterval(event) {
    this.interval = event;
    this.poReturnsService.SetDetailTimeInterval(parseInt(this.interval));
  }
}
