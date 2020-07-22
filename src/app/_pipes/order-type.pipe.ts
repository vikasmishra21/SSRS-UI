import { Pipe, PipeTransform } from '@angular/core';
import { OrderType } from "../_enums/enums.enum";
@Pipe({
  name: 'orderType'
})
export class OrderTypePipe implements PipeTransform {

  transform(orderTypeCode: number): any {
    if (!orderTypeCode) {
      return '';
    } else {
      let value = '';
      switch (orderTypeCode) {
        case OrderType.Diary:
          value = "Diary";
          break;
        case OrderType.PPM:
          value = "PPM";
          break;
        case OrderType.PR:
          value = "PR";
          break;

      }
      return value;
    }
  }

}
