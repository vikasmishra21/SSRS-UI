import { Component, OnInit } from '@angular/core';
import { PoReturnsService } from "../../_services/po-returns.service";
import { Router, RouterModule } from '@angular/router';
import { BarCodeInfo } from "../../_models/models";
import { error } from 'util';
@Component({
  selector: 'app-po-scan',
  templateUrl: './po-scan.component.html',
  styleUrls: ['./po-scan.component.css']
})
export class PoScanComponent implements OnInit {

  barcode: string = '';
  orderCode: string = '';
  passcode: string = '';
  mailingIndicator: string = '';
  mailingIndicatoroptions = [];
  constructor(private poReturnsService: PoReturnsService,
    private router: Router) { }

  ngOnInit() {
  }

  GetDetails(event) {
    this.barcode = event;
    if (this.barcode && this.barcode.length == 20) {
      this.barcode = this.barcode.toUpperCase();

      this.poReturnsService.GetBarCodeDetails(this.barcode).subscribe(barCodeInfo => {
        this.poReturnsService.GetSampleDetailsByBarCode(barCodeInfo.OrderCode, barCodeInfo.Password).subscribe(
          response => { this.ValidateResponse(response, barCodeInfo); console.log(response) },
          error => console.log(error)
        );
      }, error => { });

    }
  }

  ManualEntry() {
    //create dummy BarCode From orderCode and passCode;
    let barcode = '';

    //orderCode
    if (this.orderCode.length == 5)
      barcode += this.orderCode.toUpperCase();
    else
      alert('Invalid OrderCode');

    barcode += ' '; //language

    // passcode
    if (this.passcode.length == 9)
      barcode += this.passcode.toUpperCase();
    else
      alert('Invalid Passcode');
    barcode += 'xxxx';

    //mailIndicator
    if (this.mailingIndicator)
      barcode += this.mailingIndicator;
    else alert('Select Mailing Indicator');


    this.GetDetails(barcode);
  }

  GetMailingIndicatorOptions() {
    this.mailingIndicatoroptions = [];
    if (this.orderCode && this.orderCode.length == 5 && this.passcode && this.passcode.length == 9) {
      this.poReturnsService.GetMailingIndicatorOption(this.orderCode, this.passcode).subscribe(options => {
        if (options.length == 0) {
          alert('Mailer is not out for this sample.');
        }
        this.mailingIndicatoroptions = options;
        console.log(options);
      }, error => {
        console.log(error);
      });
    } else {
      alert('please fill orderId and password and then press enter..');
    }
  }

  ValidateResponse(response, barCodeInfo: BarCodeInfo) {
    let preIncentive = barCodeInfo.PreIncentive;
    if (response.length == 0) {
      this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Not Found');
      alert('Invalid Barcode Please check and try again.');

    }
    else if (response.length > 1) {
      this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Duplicates Found');
      alert('Multiple Samples Found for Provided Password.')
    } else {
      let sample = response[0];
      let proceedToDetails: boolean = false;
      let alreadyScannedMailingIndicator;
      if (sample.QR_Code && sample.QR_Code.length == 20) {
        alreadyScannedMailingIndicator = sample.QR_Code.substr(19, 1);
      }

      if (sample.ReceiptDate && alreadyScannedMailingIndicator && alreadyScannedMailingIndicator == barCodeInfo.MailingIndicator) {
        alert('Already Receipted..');
        this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Already Receipted');
      }
      else if (barCodeInfo.MailingIndicator == "A") {
        if (!sample.InitialMailSentOn) {
          alert('Initial mail is not out for this sample.');

          this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Invalid Code.');
        }
        else if (sample.InitialMailerScannedBy) {
          alert('provided BarCode is already Scanned..');

          this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Already Scanned');
        } else {
          proceedToDetails = true;
        }
      }
      else if (barCodeInfo.MailingIndicator == "X") {
        if (!sample.Reminder1SentOn) {
          alert('Reminder 1 mail is not out for this sample.');

          this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Invalid Code.');
        }
        else if (sample.Remainder1ScannedBy) {
          alert('provided BarCode is already Scanned..');
          this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Already Scanned');
        } else {
          proceedToDetails = true;
        }
      }
      else if (barCodeInfo.MailingIndicator == "Z") {
        if (!sample.Reminder2SentOn) {
          alert('Reminder 2 mail is not out for this sample.');

          this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Invalid Code.');
        }
        else if (sample.Remainder2ScannedBy) {
          alert('provided BarCode is already Scanned..');
          this.poReturnsService.UpdateSummaryWindow(barCodeInfo, preIncentive, 2, 'Already Scanned');
        } else {
          proceedToDetails = true;
        }
      }


      if (proceedToDetails) {
        this.poReturnsService.SetSampleAndBarInfo(sample, barCodeInfo);
        this.router.navigate(['/poreturns/scandetails']);
      } else {
        this.barcode = '';
        this.orderCode = '';
        this.passcode = '';
        this.mailingIndicator = 'A';
      }
    }
  }

}
