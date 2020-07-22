import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from 'rxjs/Observable';

@Injectable()
export class QaService {

  constructor(private apiService: ApiService) { }

  GetSample(orderCode: string, orderType: string, summaryID: number, id: number) {
    return this.apiService.Get('Qa/GetSample/' + orderCode + '/' + orderType + '/' + summaryID + '/' + id);
  }
  UpdateScoreCardingDetails(orderCode: string, summaryID: number, id: number, updateQuery: string) {
    return this.apiService.PutJSONType('Qa/UpdateScoreCardingDetails/' + orderCode + '/' + summaryID + '/' + id, updateQuery);
  }
}
