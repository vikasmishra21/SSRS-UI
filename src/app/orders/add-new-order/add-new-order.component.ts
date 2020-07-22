import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "../../_services/orders.service";
// import { NotificationsService } from 'angular2-notifications-lite';
import { Order } from '../../_models/models';
import * as moment from 'moment';

const today = new Date();
@Component({
    selector: 'app-add-new-order',
    templateUrl: './add-new-order.component.html',
    styleUrls: ['./add-new-order.component.css']
})
export class AddNewOrderComponent implements OnInit {
    @Input()
    responseOrder: Order;
    IsEdit: boolean = false;
    IsInitial: boolean = false;
    ValidateText: string = '';
    ValidatingValue: number = 0;
    minDate: NgbDateStruct = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
    DisabledFields = {
        IsRem1: false,
        IsRem2: false,
    }

    formData: any = {
        orderCode: '',
        hardCloseDate: {
            day: '',
            month: '',
            year: ''
        },
        oscTemplateName: '',
        orderType: '',
        initialMailPre: '',
        initialMailPost: '',
        Reminder1MailPre: '',
        Reminder1MailPost: '',
        Reminder2MailPre: '',
        Reminder2MailPost: '',
        cleaningRule: '',
        FactorValues: [],
        InitialIncentiveMapping: {},
        Reminder1IncentiveMapping: {},
        Reminder2IncentiveMapping: {}
    };
    localTimeZone = moment().local;

    orderType: any[] = [{ code: 1, name: 'Diary' }, { code: 2, name: 'PPM' }, { code: 3, name: 'PR' }];
    IncentiveRules: any[] = [];
    CleaningRules: any[] = [];
    months: string[] = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    years: string[] = ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30'];
    selectedItems = {
        selectedMonth: this.months[0],
        selectedYear: this.years[0]
    };

    InitialIncentiveIntegerMapping: any[] = [];
    Reminder1IncentiveIntegerMapping: any[] = [];
    Reminder2IncentiveIntegerMapping: any[] = [];

    descriptions = {
        preIncentive: '',
        postIncentive: '',
        preReminder1: '',
        postReminder1: '',
        preReminder2: '',
        postReminder2: '',
        cleaning: ''
    }
    regex = new RegExp('^(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)(17|18|19|20|21|22|23|24|25|26|27|28|29|30)-\\w{5}-\\w{2}$');
    error: boolean = false;
    errorMessage: string = '';
    IncentiveInteger: string[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    IntegerList = [];
    DuplicateIntegerList = [];
    constructor(public activeModal: NgbActiveModal,
        private ordersService: OrdersService) { }

    ngOnInit() {
        this.getCleaningRules();
        if (this.responseOrder != null) {
            this.formData.orderCode = this.responseOrder.OrderCode;
            this.formData.oscTemplateName = this.responseOrder.OSCTemplateName;
            this.formData.orderType = this.responseOrder.OrderType;
            this.formData.initialMailPre = this.responseOrder.PreIncentiveRuleID_Mailing;
            this.formData.initialMailPost = this.responseOrder.PostIncentiveRuleID_Mailing;
            this.formData.Reminder1MailPre = this.responseOrder.PreIncentiveRuleID_Reminder1;
            this.formData.Reminder1MailPost = this.responseOrder.PostIncentiveRuleID_Reminder1;
            this.formData.Reminder2MailPre = this.responseOrder.PreIncentiveRuleID_Reminder2;
            this.formData.Reminder2MailPost = this.responseOrder.PostIncentiveRuleID_Reminder2;
            this.formData.cleaningRule = this.responseOrder.CleaningRuleID;
            let closeDate = new Date(this.responseOrder.HardCloseDate + "Z");

            this.formData.hardCloseDate.day = closeDate.getDate();
            this.formData.hardCloseDate.month = closeDate.getMonth() + 1;
            this.formData.hardCloseDate.year = closeDate.getFullYear();
            //check for hard close date
            this.IsEdit = true;
            if (this.responseOrder.SampleCount != 0) {
                this.IsInitial = true;
            }
            this.MakeFieldsDisable();
            this.getIncentiveRules(this.formData.orderType);
        }
    }

    MakeFieldsDisable() {
        this.ordersService.GetDisabledFields(this.formData.orderCode).subscribe(
            response => {
                this.DisabledFields.IsRem1 = response["rem1"];
                this.DisabledFields.IsRem2 = response["rem2"];
            },
            error => console.log(error)
        )
    }

    getIncentiveRules(event) {
        this.formData.orderType = event;
        this.ordersService.GetIncentiveRules(this.formData.orderType).subscribe(
            response => this.IncentiveRules = response,
            error => console.log(error)
        )
    }
    getCleaningRules() {
        this.ordersService.GetCleaningRules().subscribe(
            response => this.CleaningRules = response,
            error => console.log(error)
        )
    }

    CreateOrder() {
        this.ValidatingValue = 0;
        if (this.IsEdit) {
            this.editOrder();
        }
        else {
            this.error = false;
            this.validateForm();
            this.IntegerList = [];
            this.DuplicateIntegerList = [];
            this.PopulateFactorValues(this.formData.InitialIncentiveMapping);
            this.PopulateFactorValues(this.formData.Reminder1IncentiveMapping);
            this.PopulateFactorValues(this.formData.Reminder2IncentiveMapping);
            if (this.DuplicateIntegerList.length > 0) {
                if (this.ValidateMapping()) {
                    this.error = true;
                    this.errorMessage = "**Same integer value cannot be assign to different factors.";
                }

            }

            if (!this.error) {
                //new Date(2017, 9 - 1, 17, 0)
                let hardCloseDate = new Date(this.formData.hardCloseDate.year, this.formData.hardCloseDate.month - 1, this.formData.hardCloseDate.day).toUTCString();
                this.formData.oscTemplateName = this.selectedItems.selectedMonth + this.selectedItems.selectedYear + '-' + this.formData.orderCode.toUpperCase();
                let order = this.ordersService.CreateNewOrder(this.formData.orderCode.toUpperCase(), hardCloseDate,
                    this.formData.oscTemplateName, this.formData.orderType, this.formData.initialMailPre,
                    this.formData.initialMailPost, this.formData.Reminder1MailPre, this.formData.Reminder1MailPost,
                    this.formData.Reminder2MailPre, this.formData.Reminder2MailPost, this.formData.cleaningRule, this.formData.FactorValues,
                    this.formData.InitialIncentiveMapping, this.formData.Reminder1IncentiveMapping, this.formData.Reminder2IncentiveMapping);

                this.ordersService.SaveOrder(order).subscribe(
                    response => {
                        // this.notificationsService.success('Order Added', 'Order Added succesfully with code ' + this.formData.orderCode);
                        this.activeModal.close('order added');
                    },
                    error => console.log(error)
                );
            }
        }
    }
    editOrder() {
        let updateFields = {
            PostIncentiveRuleID_Reminder1: 0,
            PreIncentiveRuleID_Reminder1: 0,
            PreIncentiveRuleID_Reminder2: 0,
            PostIncentiveRuleID_Reminder2: 0
        };
        let isValidateCall = false;

        if (this.responseOrder.SampleCount > 0) {
            if (!this.DisabledFields.IsRem1) {
                if (this.responseOrder.PostIncentiveRuleID_Reminder1 != this.formData.Reminder1MailPost) {
                    updateFields.PostIncentiveRuleID_Reminder1 = this.formData.Reminder1MailPost;
                    isValidateCall = true;
                }
                if (this.responseOrder.PreIncentiveRuleID_Reminder1 != this.formData.Reminder1MailPre) {
                    updateFields.PreIncentiveRuleID_Reminder1 = this.formData.Reminder1MailPre;
                    isValidateCall = true;
                }
            }
            if (!this.DisabledFields.IsRem2) {
                if (this.responseOrder.PreIncentiveRuleID_Reminder2 != this.formData.Reminder2MailPre) {
                    updateFields.PreIncentiveRuleID_Reminder2 = this.formData.Reminder2MailPre;
                    isValidateCall = true;
                }
                if (this.responseOrder.PostIncentiveRuleID_Reminder2 != this.formData.Reminder2MailPost) {
                    updateFields.PostIncentiveRuleID_Reminder2 = this.formData.Reminder2MailPost;
                    isValidateCall = true;
                }
            }
        }

        if (isValidateCall) {
            //validate 
            //if validate success then update
            //call update order
            this.ValidatingValue = 50;
            this.ValidateText = "Validating Rules";
            this.ordersService.ValidateRules(updateFields, this.responseOrder.OrderCode, false).subscribe(
                response => {
                    this.ValidatingValue = 75;
                    this.ValidateText = "Updating Rules";
                    this.ordersService.ValidateRules(updateFields, this.responseOrder.OrderCode, true).subscribe(
                        response => {
                            this.ValidatingValue = 100;
                            this.ValidateText = "Completed";
                            this.updateOrder();

                        })
                })
        }
        else
            this.updateOrder();

    }

    updateOrder() {
        this.responseOrder.HardCloseDate = new Date(this.formData.hardCloseDate.year, this.formData.hardCloseDate.month - 1, this.formData.hardCloseDate.day).toUTCString();
        this.responseOrder.CleaningRuleID = this.formData.cleaningRule;
        this.responseOrder.PostIncentiveRuleID_Mailing = this.formData.initialMailPost;
        this.responseOrder.PreIncentiveRuleID_Mailing = this.formData.initialMailPre;
        this.responseOrder.PostIncentiveRuleID_Reminder1 = this.formData.Reminder1MailPost;
        this.responseOrder.PreIncentiveRuleID_Reminder1 = this.formData.Reminder1MailPre;
        this.responseOrder.PreIncentiveRuleID_Reminder2 = this.formData.Reminder2MailPre;
        this.responseOrder.PostIncentiveRuleID_Reminder2 = this.formData.Reminder2MailPost;
        this.responseOrder.IsActive = 1;
        this.ordersService.UpdateOrder(this.responseOrder).subscribe(
            response => {
                // this.notificationsService.success('Order Updated', 'Order Updated succesfully with code ' + this.formData.orderCode);
                this.activeModal.close('order updated');
            },
        )
    }

    private validateOrderCode() {
        if (this.formData.orderCode) {
            if (this.formData.orderCode.length != 5) {
                this.errorMessage = "**Order code must contain 5 characters.";
                this.error = true;
            }
        }
        else {
            this.errorMessage = "**Please fill all the fields.";
            this.error = true;
        }
    }

    private validateTemplateName() {
        if (this.formData.oscTemplateName) {
            if (!this.regex.test(this.formData.oscTemplateName)) {
                this.errorMessage = "**Template Name must be in correct format.";
                this.error = true;
            }
        }
        else {
            this.errorMessage = "**Please fill all the fields.";
            this.error = true;
        }
    }

    private validateForm() {
        this.validateOrderCode();
        if (!this.error) {
            //this.validateTemplateName();
            // if (!this.error) {
            if (!this.formData.hardCloseDate || !this.formData.orderType || !this.formData.initialMailPre || !this.formData.initialMailPost || !this.formData.Reminder1MailPre || !this.formData.Reminder1MailPost || !this.formData.cleaningRule) {
                this.errorMessage = "**Please fill all the fields.";
                this.error = true;
            }
            // }
        }
    }

    PopulateIncentiveInteger($event, type, IncentiveValue) {
        if (IncentiveValue == "5" || IncentiveValue == "10") {
            this.showAlert($event, type, IncentiveValue);
        }
        else
            this.setIntegerMapping($event.target.value, type, IncentiveValue);
    }

    showAlert($event, type, IncentiveValue) {
        var r = confirm("Do you want to change the incentive integer mapping?");
        if (r == false) {
            if (IncentiveValue == "5")
                $event.target.value = "1";
            else if (IncentiveValue == "10")
                $event.target.value = "2";
        }
        this.setIntegerMapping($event.target.value, type, IncentiveValue);
    }

    setIntegerMapping(integer, type, IncentiveValue) {
        if (type == 'Initial')
            this.formData.InitialIncentiveMapping[IncentiveValue] = integer;
        else if (type == 'Reminder1')
            this.formData.Reminder1IncentiveMapping[IncentiveValue] = integer;
        else if (type == 'Reminder2')
            this.formData.Reminder2IncentiveMapping[IncentiveValue] = integer;
    }

    RuleChanged(rule, type) {
        if (type == 'Initial') {
            this.formData.InitialIncentiveMapping = {};
            this.InitialIncentiveIntegerMapping = [];

        }
        else if (type == 'Reminder1') {
            this.formData.Reminder1IncentiveMapping = {};
            this.Reminder1IncentiveIntegerMapping = [];

        }
        else if (type == 'Reminder2') {
            this.formData.Reminder2IncentiveMapping = {};
            this.Reminder2IncentiveIntegerMapping = [];

        }
        var ruleString = parseInt(rule);

        if (!isNaN(ruleString)) {
            this.PushValue(type, rule);
        }
        else {
            var arrayOfValues = rule.split('Value : ');
            for (var i = 1; i < arrayOfValues.length; i++) {
                var value = arrayOfValues[i].substring(0, 2)
                var finalValue = value.trim();
                this.PushValue(type, finalValue);
            }
        }

    }
    // GetIntegerMappingModel(incentive) { return this.formData.InitialIncentiveMapping[incentive]; }
    PushValue(type, value) {
        let integer = "1";
        if (value == "10")
            integer = "2";
        else if (value == "5") {
            integer = "1";
        }
        value = parseInt(value);
        if (type == 'Initial') {
            if (this.InitialIncentiveIntegerMapping.indexOf(value) === -1) {
                this.InitialIncentiveIntegerMapping.push(value);
                this.formData.InitialIncentiveMapping[value] = integer;
                // this.PopulateIncentiveInteger(integer, 'Initial', value, false);
            }
        }
        else if (type == 'Reminder1') {
            if (this.Reminder1IncentiveIntegerMapping.indexOf(value) === -1) {
                this.Reminder1IncentiveIntegerMapping.push(value);
                this.formData.Reminder1IncentiveMapping[value] = integer;
                //  this.PopulateIncentiveInteger(integer, 'Reminder1', value, false);
            }
        }
        else if (type == 'Reminder2') {
            if (this.Reminder2IncentiveIntegerMapping.indexOf(value) === -1) {
                this.Reminder2IncentiveIntegerMapping.push(value);
                this.formData.Reminder2IncentiveMapping[value] = integer;
                //this.PopulateIncentiveInteger(integer, 'Reminder2', value, false);
            }
        }
    }

    PopulateFactorValues(mapping) {
        let keys = Object.keys(mapping);
        for (var key in keys) {
            if (this.formData.FactorValues.indexOf(keys[key]) == -1)
                this.formData.FactorValues.push(keys[key]);
            if (this.IntegerList.indexOf(mapping[keys[key]]) != -1) {
                if (this.DuplicateIntegerList.indexOf(mapping[keys[key]]) == -1)
                    this.DuplicateIntegerList.push(mapping[keys[key]]);
            }
            else
                this.IntegerList.push(mapping[keys[key]]);
        }
    }

    ValidateMapping() {
        for (var i = 0; i < this.DuplicateIntegerList.length; i++) {
            if (!this.checkInside(this.formData.InitialIncentiveMapping, this.DuplicateIntegerList[i])) {
                if (!this.checkInside(this.formData.Reminder1IncentiveMapping, this.DuplicateIntegerList[i])) {
                    if (!this.checkInside(this.formData.Reminder2IncentiveMapping, this.DuplicateIntegerList[i])) {
                        return this.checkOutSide(this.DuplicateIntegerList[i]);
                    }
                    else
                        return true;
                }
                else
                    return true;
            }
            else
                return true;

        }
    }

    GetFactor(mapping, integer) {
        let keys = Object.keys(mapping);
        for (var key in keys) {
            if (mapping[keys[key]] == integer)
                return keys[key];
        }
        return null;
    }

    checkOutSide(integer) {
        let IValue = this.GetFactor(this.formData.InitialIncentiveMapping, integer);
        let R1Value = this.GetFactor(this.formData.Reminder1IncentiveMapping, integer);
        let R2Value = this.GetFactor(this.formData.Reminder2IncentiveMapping, integer);
        let returnFlag = false;
        if (IValue) {
            returnFlag = this.checkSameValue(R1Value, R2Value, IValue);
        }
        else {
            if (R1Value != R2Value)
                returnFlag = true;
        }
        return returnFlag;
    }

    checkSameValue(val1, val2, checkValue) {
        if (val1) {
            if (checkValue != val1)
                return true;
            else
                return false;
        }
        else {
            if (checkValue != val2)
                return true;
            else
                return false;
        }
    }

    checkInside(mapping, integer) {
        let keys = Object.keys(mapping);
        let v = [];
        for (var key in keys) {
            if (mapping[keys[key]] == integer)
                v.push(keys[key]);
        }
        if (v.length > 1)
            return true;
        else
            return false;
    }

}
