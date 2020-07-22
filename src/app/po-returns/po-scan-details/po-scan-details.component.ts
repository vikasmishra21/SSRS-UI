import { Component, OnInit } from '@angular/core';
import { BarCodeInfo } from '../../_models/models';
import { PoReturnsService } from "../../_services/po-returns.service";

import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-po-scan-details',
  templateUrl: './po-scan-details.component.html',
  styleUrls: ['./po-scan-details.component.css']
})

export class PoScanDetailsComponent implements OnInit {
  sample: any;
  barCodeInfo: BarCodeInfo = new BarCodeInfo();

  selectedReturnCode: string = '';
  preIncentive: number;
  redCodes: any[];
  greenCodes: any[];
  imageHtml = '';
  constructor(private router: Router, private poReturnsService: PoReturnsService) { }

  ngOnInit() {
    this.sample = this.poReturnsService.GetSample();
    if (!this.sample)
      this.router.navigate(['/poreturns/scan']);
    else {
      this.barCodeInfo = this.poReturnsService.GetBarCodeInfo();
      this.preIncentive = this.barCodeInfo.PreIncentive;
      this.GetReturnCodes();
    }

  }

  SetImage() {
    if(this.barCodeInfo.Language=='E' && this.barCodeInfo.MailingIndicator=='X')
          this.barCodeInfo.PreIncentive = 100;
    return this.poReturnsService.GetBinImage(this.barCodeInfo.PreIncentive, true);
    // return this.poReturnsService.GetBinImage(5, true);

  }

  Update(event) {
    if (this.selectedReturnCode) {
      if (this.barCodeInfo.MailingIndicator == "A") {
        this.sample.InitialMailerScannedBy = 'Admin';
        this.sample.InitialPOReturnCodeID = this.selectedReturnCode;
        this.sample.InitialPOReturnOn = new Date().toISOString();
        this.sample.InitialPOReturnPreincentiveValue = this.preIncentive;
      }
      else if (this.barCodeInfo.MailingIndicator == "X") {
        this.sample.Remainder1ScannedBy = 'Admin';
        this.sample.Reminder1POReturnCodeID = this.selectedReturnCode;
        this.sample.Reminder1POReturnOn = new Date().toISOString();
        this.sample.Reminder1POReturnPreincentiveValue = this.preIncentive;
      }
      else if (this.barCodeInfo.MailingIndicator == "Z") {
        this.sample.Remainder2ScannedBy = 'Admin';
        this.sample.Reminder2POReturnCodeID = this.selectedReturnCode;
        this.sample.Reminder2POReturnOn = new Date().toISOString();
        this.sample.Reminder2POReturnPreincentiveValue = this.preIncentive;
      }

      this.SavePoReturn();
    } else {
      alert('Choose a return code first to Complete.')
    }
  }

  SavePoReturn() {
    this.poReturnsService.SavePoReturn(this.barCodeInfo.OrderCode, this.barCodeInfo.Password, this.barCodeInfo.MailingIndicator, this.sample).subscribe(
      response => {
        this.poReturnsService.UpdateSummaryWindow(this.barCodeInfo, this.preIncentive, 1, 'OK');
        this.router.navigate(['/poreturns/scan']);
        // console.log(response)
      },
      error => console.log(error)
    );
  }

  SetReturnCode(code) {
    this.selectedReturnCode = code;
    this.SetTimeOut();

  }
  GetReturnCodes() {
    this.poReturnsService.GetReturnCodes().subscribe(
      response => {
        this.BindReturnCodes(response);
        
      },
      error => console.log(error)
    );
  }

  BindReturnCodes(response: any[]) {
    this.redCodes = new Array();
    this.greenCodes = new Array();
    response.forEach(element => {
      if (element.Color == 1)
        this.redCodes.push(element);
      else
        this.greenCodes.push(element);
    });
  }

  SetTimeOut() {
    setTimeout(() => {
      this.Update(null);
      // this.router.navigate(['/poreturns/scan']);
    }, this.poReturnsService.GetDetailTimeInterval());
  }
}
