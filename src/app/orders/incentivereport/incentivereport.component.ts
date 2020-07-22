import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router } from "@angular/router";
import { Angular2Csv } from 'angular2-csv/Angular2-csv';

@Component({
    selector: 'app-incentivereport',
    templateUrl: './incentivereport.component.html',
    styleUrls: ['./incentivereport.component.css']
})
export class IncentivereportComponent implements OnInit {
    orderCode: string = '';
    constructor(private orderService: OrdersService, private router: Router) { }
    responseArray = {
        InitialMailerPreIncentive: 0,
        Reminder1MailerPreIncentive: 0,
        Reminder2MailerPreIncentive: 0,
        PromisedReturn: 0,
        Reminder2POreturns: 0,
        InitialPOReturns: 0,
        Reminder1POreturns: 0,
        totalOutFlow: 0,
        totalInFlow: 0,
        netCost: 0,
    };
    arrayOfData = [];
    ngOnInit() {
        this.orderCode = this.orderService.GetOrderCode();
        if (!this.orderCode) {
            this.router.navigate(['/orders/overview']);
        }
        this.getIncentiveReport();
    }

    getIncentiveReport() {
        this.orderService.GetIncentiveReport(this.orderCode).subscribe(
            response => {
                this.responseArray = response[0];
                if (this.responseArray.InitialMailerPreIncentive == null)
                    this.responseArray.InitialMailerPreIncentive = 0;
                if (this.responseArray.Reminder1MailerPreIncentive == null)
                    this.responseArray.Reminder1MailerPreIncentive = 0;
                if (this.responseArray.Reminder2MailerPreIncentive == null)
                    this.responseArray.Reminder2MailerPreIncentive = 0;
                if (this.responseArray.PromisedReturn == null)
                    this.responseArray.PromisedReturn = 0;
                if (this.responseArray.InitialPOReturns == null)
                    this.responseArray.InitialPOReturns = 0;
                if (this.responseArray.Reminder1POreturns == null)
                    this.responseArray.Reminder1POreturns = 0;
                if (this.responseArray.Reminder2POreturns == null)
                    this.responseArray.Reminder2POreturns = 0;
       
                this.responseArray.totalOutFlow = this.responseArray.InitialMailerPreIncentive + this.responseArray.Reminder1MailerPreIncentive + this.responseArray.Reminder2MailerPreIncentive + this.responseArray.PromisedReturn,
                    this.responseArray.totalInFlow = this.responseArray.InitialPOReturns + this.responseArray.Reminder1POreturns + this.responseArray.Reminder2POreturns,
                    this.responseArray.netCost = this.responseArray.totalOutFlow - this.responseArray.totalInFlow

            },
            error => { console.log("error in getting report") }
        )
    }


    DownloadCSV() {
        var options = {
            fieldSeparator: ',',
            quoteStrings: '"',
            decimalseparator: '.',
            showLabels: true,
            showTitle: false,
            headers: Object.keys(this.responseArray),
        };
        this.arrayOfData.push(this.responseArray);
        new Angular2Csv(this.arrayOfData, 'IncentiveReport', options);
    }
}
