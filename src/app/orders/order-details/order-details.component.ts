import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { Chart, Order, IncentiveRule } from "../../_models/models";
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddNewOrderComponent } from '../add-new-order/add-new-order.component';
import { util } from '../../_models/utils'
const today = new Date();

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {

    orderCode: string = '';
    Order: Order = new Order('');
    ClosedOrder = false;
    ViewAllData = false;
    preIncentiveInitial = false;
    preruleIncentiveRem1 = false;
    preruleIncentiveRem2 = false;
    postruleIncentiveRem1 = false;
    postruleIncentiveRem2 = false;
    cleaningRule = false;
    postIncentiveInitial = false;
    chartUpdate = false;
    minDate: NgbDateStruct;
    IncentiveDetails = {
        postruleIncentiveInitial: new IncentiveRule(),
        postruleIncentiveRem1: new IncentiveRule(),
        preruleIncentiveInitial: new IncentiveRule(),
        preruleIncentiveRem1: new IncentiveRule(),
        postruleIncentiveRem2: new IncentiveRule(),
        preruleIncentiveRem2: new IncentiveRule(),
        cleaningRule: new IncentiveRule(),
    }


    OrderDetails = {
        RecordsReceiptedOSC: null,
        RecordsFinalizedOSC: null,
        PhoneCompletes: null,
        TotalIncentiveDisbursed: null,
        TotalRecordsPulled: null,
        ContactInfoAccuracy: null,
        DemographicsAccuracy: null,
        OtherInfoAccuracy: null,
        ResponseRate: null,
        Initial_PO_Return_Count:null,
        Reminder1_PO_Return_Count:null,
        Reminder2_PO_Return_Count:null
    }
    DateFilterFrom: NgbDateStruct;
    DateFilterTo: NgbDateStruct;

    View = {
        ViewAllData: true,
    }
    chart: Chart;

    constructor(private router: Router, private orderService: OrdersService, private modalService: NgbModal) {
        this.orderService.uploadSamples.subscribe(
            res => {
                this.ngOnInit();
            }
        );

    }

    ngOnInit() {
        localStorage.removeItem('columnSelector');
        this.orderCode = this.orderService.GetOrderCode();
        if (!this.orderCode) {
            this.router.navigate(['/orders/overview']);
        } else
            this.getOrder();
    }

    getOrder() {
        this.orderService.GetOrder(this.orderCode).subscribe(
            response => {
                this.Order = response;
                if (new Date(this.Order.HardCloseDate) < new Date())
                    this.ClosedOrder = false; //ssrs change allow edit hardclose at any point
                this.GetOrderDetails(null, null);
            },
            error => console.log(error)
        );
    }

    GetOrderDetails(event, type) {
        //if (this.View.ViewAllData)
        // this.setDateFilters();
        this.chartUpdate = false;
        let filters = this.getAppliedFilters(event, type);
        this.orderService.GetOrderDetails(this.orderCode, filters).subscribe(
            response => { this.OrderDetails = response; this.GetIncentiveDetails(); this.bindGauge(this.OrderDetails.ResponseRate); },
            error => console.log(error)
        );
    }

    GetIncentiveDetails() {
        this.orderService.GetIncentiveDetails(this.orderCode).subscribe(
            response => {
                this.IncentiveDetails = response;
                console.log(this.IncentiveDetails);

            },
            error => console.log(error)
        );
    }

    getAppliedFilters(event, type) {
        if (this.View.ViewAllData)
            this.setDateFilters();
        else {
            if (type == 'to')
                this.DateFilterTo = { year: event.year, month: event.month, day: event.day };
            else if (type == 'from')
                this.DateFilterFrom = { year: event.year, month: event.month, day: event.day };
            this.minDate = this.DateFilterFrom;
        }
        let filterStr = '?'
        if (this.DateFilterFrom) {
            filterStr += 'FromDate=' + this.DateFilterFrom.year + "-" + this.DateFilterFrom.month + "-" + this.DateFilterFrom.day;
        }
        if (this.DateFilterTo) {
            filterStr += '&ToDate=' + this.DateFilterTo.year + "-" + this.DateFilterTo.month + "-" + this.DateFilterTo.day;
        }
        return filterStr;
    }

    bindGauge(responseRate) {
        this.chartUpdate = true;
        let response = [];
        response.push(responseRate);
        var chartConfig = {
            id: 'gaugeChartResponses',
            data: {
                "type": "gauge",
                "scale-r": {
                    "aperture": 200, //Scale Range
                    "values": "0:100:10" //and minimum, maximum, and step scale values.
                },
                "series": [
                    { "values": [responseRate] }
                ],
                "plot": {
                    "valueBox": {
                        "placement": "center",
                        "text": "%v"
                    }
                }

            }
        };
        this.chart = new Chart(chartConfig);
    }

    OpenAddNewOrderModal() {
        const modalRef = this.modalService.open(AddNewOrderComponent);
        modalRef.componentInstance.responseOrder = this.Order;
        modalRef.result.then((result) => {
            this.getOrder();
            this.orderService.newOrderAdded.emit('Order Edited');
        }, (reason) => {
            this.orderService.newOrderAdded.emit('closed');
        });

    }

    DisableShowAllData() {
        this.View.ViewAllData = false;
        this.minDate = this.DateFilterFrom;
    }

    setDateFilters() {
        let utilObj = new util();
        let hardCloseDate = utilObj.ConvertUTCDateToLocal(this.Order.HardCloseDate);
        //let hardCloseDate = new Date(this.Order.HardCloseDate);
        let createdOn = utilObj.ConvertUTCDateToLocal(this.Order.CreatedOn);
        // new Date(this.Order.CreatedOn);
        this.DateFilterTo = { year: hardCloseDate.getFullYear(), month: hardCloseDate.getMonth() + 1, day: hardCloseDate.getDate() };
        this.DateFilterFrom = { year: createdOn.getFullYear(), month: createdOn.getMonth() + 1, day: createdOn.getDate() };
        this.minDate = this.DateFilterFrom;
    }


}
