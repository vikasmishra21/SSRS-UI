import { Injectable } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from 'rxjs/Observable';
@Injectable()
export class RecordMatchingService {

  constructor(private apiService: ApiService) { }

  UploadFile(file: FormData, matchType: string): Observable<any> {
    return this.apiService.PostFiles('RecordMatching/File/' + matchType, file);
  }
}
