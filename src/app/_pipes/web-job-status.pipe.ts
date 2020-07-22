import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'webJobStatus'
})
export class WebJobStatusPipe implements PipeTransform {

  transform(code: string): any {
    if (!code) {
      return '';
    } else {
      let value = '';
      switch (code) {
        case "1":
          value = "Pending";
          break;
        case "2":
          value = "Validating";
          break;
        case "3":
          value = "Validated";
          break;
        case "4":
          value = "Uploading";
          break;
        case "5":
          value = "Uploaded";
          break;
        case "6":
          value = "Processing";
          break;
        case "7":
          value = "Completed";
          break;
        case "99":
          value = "Failed";
          break;

      }
      return value;
    }
  }

}
