import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from 'rxjs/Observable';
import { BarCodeInfo, PoReturnProblem } from '../_models/models';
import * as _ from 'underscore';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';

@Injectable()
export class PoReturnsService {
  private _sample;
  private _barcodeInfo: BarCodeInfo;

  UpdateSummaryWindowEmmiter = new EventEmitter<string>();

  SetSampleAndBarInfo(sample: any, barCodeInfo: BarCodeInfo) {
    this._sample = sample;
    this._barcodeInfo = barCodeInfo;
  }

  GetDetailTimeInterval() {
    let interval: any = localStorage.getItem('timeinterval');
    if (!interval)
      interval = 1000;
    else {
      interval = parseInt(JSON.parse(interval));
    }
    return interval;
  }

  SetDetailTimeInterval(interval: number) {
    localStorage.setItem('timeinterval', interval.toString());
  }

  GetSample() {
    return this._sample;
  }
  GetBarCodeInfo() {
    return this._barcodeInfo;
  }
  GetBinImage(currency, lg?: boolean) {
    let image = '';
    // let barcodeInfo = this.GetBarCodeInfo();

    // if((barcodeInfo!=null || barcodeInfo!=undefined) && barcodeInfo.Language=='E' && barcodeInfo.MailingIndicator=='X')
    //        image = '<img src="assets/images/shred.png" alt="Smiley face" height="40" width="40">';
    // else
    // {
      switch (currency) {
        case 2:
          image = lg ? '<img src="assets/images/money-bag.png" alt="Smiley face" height="40" width="40">' : '<img src="assets/images/money-bag.png" alt="Smiley face" height="32" width="32">';
          break;
        case 5:
          image = lg ? '<img src="assets/images/dollar.png" alt="Smiley face" height="40" width="100">' : '<img src="assets/images/dollar.png" alt="Smiley face" height="25" width="60">';
          break;
        case 10:
          image = lg ? '<img src="assets/images/Number.png" alt="Smiley face" height="40" width="40">' : '<img src="assets/images/Number.png" alt="Smiley face" height="22" width="32">';
          break;
        case 0:
          image = lg ? '<img src="assets/images/flag.png" alt="Smiley face" height="40" width="40">' : '<img src="assets/images/flag.png" alt="Smiley face" height="32" width="32">';
          break;
        case 100:
            image = lg ? '<img src="assets/images/shred.png" alt="Smiley face" height="40" width="40">' : '<img src="assets/images/shred.png" alt="Smiley face" height="40" width="40">';
            break;
        default:
          image = '<span class="badge badge-warning"><strong>' + currency + '</strong></span>';
          break;
      }
    //}
    return image;
  }

  GetShredImage() {
    let image = '';
    
    image =  '<img src="assets/images/shred.png" alt="Smiley face" height="40" width="40">';
       
    return image;
  }

  UpdateSummaryWindow(barCodeInfo: BarCodeInfo, preincentive: any, status: number, statusText: string) {
    let runningSummary = {
      ordercode: barCodeInfo.OrderCode,
      password: barCodeInfo.Password,
      preincentive: preincentive,
      status: status,
      statusText: statusText
    }

    let scannedList = JSON.parse(localStorage.getItem('runningSummaryList')) || [];
    scannedList.push(runningSummary);
    localStorage.setItem('runningSummaryList', JSON.stringify(scannedList));
 let isShred = false;
 if(barCodeInfo.Language=='E' && barCodeInfo.MailingIndicator=='X')
        isShred = true;

    if (status == 1) {
      this.SaveBin(preincentive,isShred);
    }

    this.UpdateSummaryWindowEmmiter.emit('windowUpdated');
  }

  private SaveBin(preincentive: any,isShred): void {
    let binStorage = JSON.parse(localStorage.getItem('bin')) || [];
    let node = _.findWhere(binStorage, { currency: preincentive,isShred: isShred });

    if (!node) {
      node = {
        currency: preincentive, count: 0,isShred:isShred
      }
      binStorage.push(node);
    }
    
    node.count = node.count + 1;
    node.amount = node.currency * node.count;
    // binStorage.push(node);
    localStorage.setItem('bin', JSON.stringify(binStorage));
  }

  constructor(private apiService: ApiService) { }

  // Api Calls
  // PoReturnsController
  GetSampleDetailsByBarCode(ordercode: string, password: string): Observable<any> {
    return this.apiService.Get('PoReturns/GetSampleDetailsByBarCode/' + ordercode + '/' + password);
  }
  GetReturnCodes(): Observable<any> {
    return this.apiService.Get('PoReturns/GetPoReturnCodes');
  }
  SavePoReturn(ordercode: string, password: string, mailingIndicator: string, sampleEntity: any): Observable<any> {
    return this.apiService.Put('PoReturns/SavePoReturn/' + ordercode + '/' + password + '/' + mailingIndicator, sampleEntity);
  }
  GetDailyReport(partitionKey: string): Observable<any> {
    return this.apiService.Get('PoReturns/GetDailyReport/' + partitionKey);
  }
  SavePoReturnProblem(poReturnProblem: PoReturnProblem): Observable<any> {
    return this.apiService.Put('PoReturns/SavePoReturnProblem', poReturnProblem);
  }
  IsPoScanned(barcodeInfo: BarCodeInfo) {
    return this.apiService.Put('PoReturns/IsPoScanned', barcodeInfo);
  }
  //Survey Controller
  GetBarCodeDetails(barcode: string): Observable<any> {
    return this.apiService.Get('survey/' + barcode);
  }

  GetMailingIndicatorOption(ordercode: string, password: string): Observable<any> {
    return this.apiService.Get('PoReturns/GetMailingIndicatorOption/' + ordercode + '/' + password);
  }

  DownloadPdf(dailyObject): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
    return this.apiService.DownloadCSV('PoReturns/GetPDFDailyReport', dailyObject, options);
  }
}
