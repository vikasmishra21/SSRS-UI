import { Pipe, PipeTransform } from '@angular/core';
import { util } from '../_models/utils'
import * as moment from 'moment';

@Pipe({
    name: 'dateLocal'
})
export class DateLocalPipe implements PipeTransform {

    transform(dateValue: any): any {
        if (!dateValue) {
            return '';
        } else {

            let utilObj = new util();
            let localDate = utilObj.ConvertUTCDateToLocal(dateValue);

            return localDate.toString();

            // let dateMoment = new Date(dateValue + "Z");
            // // let closeDate = new Date(this.responseOrder.HardCloseDate + "Z");

            // let day = dateMoment.getDate();
            // let month = dateMoment.getMonth() + 1;
            // let year = dateMoment.getFullYear();
            // let finalDate = month + "/" + day + "/" + year;
            // //return moment(dateMoment).format("MM-DD-YYYY");
            // return finalDate;

        }
    }
}
