import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class LoaderSeviceService {

  showLoader: Observable<any>;

  hideLoader: Observable<any>;

  private _showLoaderObserver: Observer<any>;
  private _hideLoaderObserver: Observer<any>;

  constructor() {
    this.showLoader = new Observable(observer => this._showLoaderObserver = observer);
    this.hideLoader = new Observable(observer => this._hideLoaderObserver = observer);
  }

  ShowLoader() {
    this._showLoaderObserver.next("");
  }

  HideLoader() {
    this._hideLoaderObserver.next("");
  }
}
