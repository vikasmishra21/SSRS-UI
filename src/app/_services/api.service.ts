import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { Headers, RequestOptions } from "@angular/http";
import { LoaderSeviceService } from "../_services/loader-sevice.service";

import { Observable } from "rxjs/Observable";

import "rxjs/add/operator/catch";
import "rxjs/add/operator/map";
import "rxjs/add/observable/throw";
import { CATCH_ERROR_VAR } from "@angular/compiler/src/output/abstract_emitter";

@Injectable()
export class ApiService {
   //private _apiurl = 'https://ssrspanelApi.azurewebsites.net/api/';
    // private _apiurl = 'https://ssrs-staging-api.azurewebsites.net/api/'; //live-server
   private _apiurl = 'https://ssrspaneltestapi.azurewebsites.net/api/'; //test-server
  // private _apiurl = 'http://localhost:49839/api/';  // local-server

  constructor(
    private http: Http,
    private loadingService: LoaderSeviceService
  ) {}

  Get(urlPostfix?: string, options?: any): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    return this.http
      .get(url, options)
      .map(this.parseData.bind(this))
      .catch(this.handleError.bind(this));
  }

  Download(urlPostfix?: string, options?: any): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    return this.http
      .get(url, options)
      .map(
        (res: Response): Blob => {
          this.loadingService.HideLoader();
          return res.ok ? res.blob() : undefined;
        }
      )
      .catch(this.handleError.bind(this));
  }

  DownloadCSV(urlPostfix?: string, data?: any, options?: any): Observable<any> {
    const url = this._apiurl + urlPostfix;
    this.loadingService.ShowLoader();
    return this.http
      .post(url, data, options)
      .map(
        (res: Response): Blob => {
          this.loadingService.HideLoader();
          return res.ok ? res.blob() : undefined;
        }
      )
      .catch(this.handleError.bind(this));
  }

  Post(urlPostfix?: string, data?: any): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(url, data, options)
      .map(this.parseData.bind(this))
      .catch(this.handleError.bind(this));
  }

  PostFiles(urlPostfix?: string, data?: any): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    return this.http
      .post(url, data)
      .map(this.parseData.bind(this))
      .catch(this.handleError.bind(this));
  }

  Delete(urlPostfix?: string): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    return (
      this.http
        .delete(url)
        .pipe((res) => {
          setTimeout((x) => {
            this.loadingService.HideLoader();
          }, 1000);
          return res;
        })
        // .map(this.parseData)
        .catch(this.handleError.bind(this))
    );
  }

  Put(urlPostfix?: string, data?: any): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    return this.http
      .put(url, data)
      .map(this.parseData.bind(this))
      .catch(this.handleError.bind(this));
  }
  PutJSONType(urlPostfix?: string, data?: any): Observable<any> {
    this.loadingService.ShowLoader();
    const url = this._apiurl + urlPostfix;
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .put(url, data, options)
      .map(this.parseData.bind(this))
      .catch(this.handleError.bind(this));
  }

  // This method parses the data to JSON
  private parseData(res: Response) {
    try {
      this.loadingService.HideLoader();
      return res.json() || [];
    } catch (exception) {
      this.loadingService.HideLoader();
      return res.arrayBuffer();
    }
  }
  // Displays the error message
  private handleError(error: Response | any) {
    let errorMessage: string;

    errorMessage = error.message ? error.message : error.toString();

    // In real world application, call to log error to remote server
    // logError(error);
    this.loadingService.HideLoader();
    // This returns another Observable for the observer to subscribe to
    // this.notificationService.error('Error Occured', 'Please Try Again or Contact Admin..!!');
    return Observable.throw(errorMessage);
  }
}
