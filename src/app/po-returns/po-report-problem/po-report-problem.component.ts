import { Component, OnInit } from '@angular/core';
import { BarCodeInfo, PoReturnProblem } from '../../_models/models';
import { PoReturnsService } from "../../_services/po-returns.service";
import { error } from 'util';

@Component({
  selector: 'app-po-report-problem',
  templateUrl: './po-report-problem.component.html',
  styleUrls: ['./po-report-problem.component.css']
})
export class PoReportProblemComponent implements OnInit {
  actualMoney = "1";
  PoReturnProblem: PoReturnProblem;
  barcode: string;
  problemTypeList = [{ id: 1, text: "Less Money than Expected" },
  { id: 2, text: "More Money than Expected" }, { id: 3, text: "Other Problem" }]
  constructor(private poReturnService: PoReturnsService) { }

  ngOnInit() {
    this.PoReturnProblem = new PoReturnProblem();
  }

  BarCodeChanged(event) {
    this.barcode = event;
    if (this.barcode && this.barcode.length == 20) {
      this.barcode = this.barcode.toUpperCase();
      this.poReturnService.GetBarCodeDetails(this.barcode).subscribe(barCodeInfo => {
        this.poReturnService.IsPoScanned(barCodeInfo).subscribe(result => {
          if (result == 0) {
            this.barcode = '';
            this.PoReturnProblem.BarCodeInfo = new BarCodeInfo();
            alert('PO Return is not set for this Sample.');
          } else {
            this.PoReturnProblem.BarCodeInfo = barCodeInfo;
            this.SetExpectedMoney();
          }
        }, error => {

          this.barcode = '';
          this.PoReturnProblem.BarCodeInfo = new BarCodeInfo();
          alert('Error occured Invalid Inputs..Please Try Again.');
        })


      }, error => {

        this.barcode = '';
        this.PoReturnProblem.BarCodeInfo = new BarCodeInfo();
        alert('Error occured Invalid Inputs..Please Try Again.');

        console.log(error);
      });

    }
    // this.barcode = event;
    // this.PoReturnProblem.BarCodeInfo = this.ReadBarCode();
    // if (this.PoReturnProblem.BarCodeInfo.OrderCode)
    //   this.SetExpectedMoney();
  }

  //Barcode Signature
  //[5]-OrderCode
  //[1]-Language
  //[9]-Password/UniqueId
  //[4]-IFactor
  //[1]-mailingTye viz: initial(A),Reminder1(X),Remainder2(Z) 
  ReadBarCode(): BarCodeInfo {
    if (!this.barcode || this.barcode.length != 20) {
      this.barcode = '';
      return new BarCodeInfo();
    }

    let barCodeInfo = new BarCodeInfo();
    barCodeInfo.OrderCode = this.barcode.substr(0, 5);
    barCodeInfo.Language = this.barcode.substr(5, 1);
    barCodeInfo.Password = this.barcode.substr(6, 9);
    barCodeInfo.IFactor = this.barcode.substr(15, 4);
    barCodeInfo.MailingIndicator = this.barcode.substr(19, 1);

    this.SetPasswordAndOrderType(barCodeInfo);

    return barCodeInfo;

  }

  //password in barcode  is different for different orderType
  //Diary: xxxxxxxxD
  //PPM: xxxxxxxxP
  //PR:xxxxxxxPR
  SetPasswordAndOrderType(barCodeInfo: BarCodeInfo) {
    if (barCodeInfo.Password.substr(8, 9) == "D") {
      // barCodeInfo.Password = barCodeInfo.Password.substr(0, 8);
      barCodeInfo.OrderType = 1;
    }
    else if (barCodeInfo.Password.substr(8, 9) == "P") {
      // barCodeInfo.Password = barCodeInfo.Password.substr(0, 8);
      barCodeInfo.OrderType = 2;
    }
    else {
      // barCodeInfo.Password = barCodeInfo.Password.substr(0, 7);
      barCodeInfo.OrderType = 3;
    }
  }

  SetExpectedMoney() {
    this.PoReturnProblem.ExpectedMoney = this.PoReturnProblem.BarCodeInfo.PreIncentive;
  }

  Submit() {
    let user = JSON.parse(localStorage.getItem('currentUser'));
    this.PoReturnProblem.ReportedBy = user['username'];
    let isValidated = this.ValidateForm();
    if (isValidated) {
      this.poReturnService.SavePoReturnProblem(this.PoReturnProblem).subscribe(
        response => {
          //reset fields on success
          this.actualMoney = "1";
          this.PoReturnProblem = new PoReturnProblem();
          this.barcode = '';
          console.log(response)
        },
        error => { alert('Error occured while saving problem ' + error) }
      );
    } else {
      alert('Validation Error.. Please correct all Fields');
    }
  }

  ValidateForm(): boolean {
    if ((this.PoReturnProblem.ProblemType == '' || this.PoReturnProblem.ProblemType == '3') && !this.PoReturnProblem.Notes) {
      alert('Please Specify the problem in notes field.')
      return false;
    }
    if (this.PoReturnProblem.ActualMoney == undefined) {
      alert('Please Specify the Actual Money Returned.')
      return false;
    }
    return true;
  }

  ManualEntry() {
    //create dummy BarCode From orderCode and passCode;
    let barcode = '';

    //orderCode
    if (this.PoReturnProblem.BarCodeInfo.OrderCode.length == 5)
      barcode += this.PoReturnProblem.BarCodeInfo.OrderCode.toUpperCase();
    else
      alert('Invalid OrderCode');

    barcode += ' '; //language

    // passcode
    if (this.PoReturnProblem.BarCodeInfo.Password.length == 9)
      barcode += this.PoReturnProblem.BarCodeInfo.Password.toUpperCase();
    else
      alert('Invalid Passcode');
    barcode += 'xxxx';

    //mailIndicator
    if (this.PoReturnProblem.BarCodeInfo.MailingIndicator != '')
      barcode += this.PoReturnProblem.BarCodeInfo.MailingIndicator;
    else
      alert('Invalid Mailing Indicator');

    this.BarCodeChanged(barcode);
  }

  ChangeProblemType(event) {
    this.PoReturnProblem.ProblemType = event;

    if (this.PoReturnProblem.ProblemType != "") {
      let selectedProblem = this.problemTypeList.filter((problem) => {
        return problem.id.toString() == this.PoReturnProblem.ProblemType;
      });
      if (selectedProblem.length > 0) {
        if (selectedProblem[0].id != 3)
          this.PoReturnProblem.Notes = selectedProblem[0].text;
      } else {
        this.PoReturnProblem.Notes = '';
      }
    } else this.PoReturnProblem.Notes = '';
  }

}
