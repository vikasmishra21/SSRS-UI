import { Injectable, EventEmitter } from '@angular/core';
import { ApiService } from "./api.service";
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions, ResponseContentType } from '@angular/http';

import { Order, CleaningRule, IncentiveRule } from "../_models/models";
import { Definition } from '../cross-tab/definition';
import{ExportDefinition} from '../data-export/export-definition';

@Injectable()
export class OrdersService {
    private _orderCode: string = '';
    private _orderType: string;
    private _scoreCardingID: string;
    private _scoreCardingDate: string;

    constructor(private apiService: ApiService) { }

    newOrderAdded = new EventEmitter<string>();
    uploadSamples = new EventEmitter();

    SetOrderCode(orderCode: string, orderType: string) {
        this._orderCode = orderCode;
        this._orderType = orderType;
        sessionStorage.setItem('orderCode', this._orderCode);
        sessionStorage.setItem('orderType', this._orderType);
    }

    GetOrderCode() {
        if (!this._orderCode)
            this._orderCode = sessionStorage.getItem('orderCode');
        return this._orderCode;

    }

    GetOrderType() {
        if (!this._orderType)
            this._orderType = sessionStorage.getItem('orderType');
        return this._orderType;
    }

    SetScoreCardingID(id: string, date: string) {
        this._scoreCardingID = id;
        this._scoreCardingDate = date;
        sessionStorage.setItem('scoreCardingID', this._scoreCardingID);
        sessionStorage.setItem('scoreCardingDate', this._scoreCardingDate);
    }
    GetScoreCardingID() {
        if (!this._scoreCardingID)
            this._scoreCardingID = sessionStorage.getItem('scoreCardingID');
        return this._scoreCardingID;
    }
    GetScoreCardingDate() {
        if (!this._scoreCardingDate)
            this._scoreCardingDate = sessionStorage.getItem('scoreCardingDate');
        return this._scoreCardingDate;
    }

    CreateNewOrder(_orderCode: string, _hardCloseDate: any,
        _templateName: string, _orderType: number, _preMail: number, _postMail: number,
        _preReminder1: number, _postReminder1: number, _preReminder2: number,
        _postReminder2: number, _cleaning: number, FactorValues: any, InitialIncentiveMapping: any, Rem1IncentiveMapping: any, Rem2IncentiveMapping: any) {

        var user = JSON.parse(localStorage.getItem('currentUser'));
        let order = new Order(user.username);
        order.OrderCode = _orderCode;
        order.HardCloseDate = _hardCloseDate;
        // order.ExpectedRecordCount = _expectedRecordCount;
        order.OSCTemplateName = _templateName;
        order.OrderType = _orderType;
        order.PreIncentiveRuleID_Mailing = _preMail;
        order.PostIncentiveRuleID_Mailing = _postMail;
        order.PreIncentiveRuleID_Reminder1 = _preReminder1;
        order.PostIncentiveRuleID_Reminder1 = _postReminder1;
        order.PreIncentiveRuleID_Reminder2 = _preReminder2;
        order.PostIncentiveRuleID_Reminder2 = _postReminder2;
        order.CleaningRuleID = _cleaning;
        order.FactorValues = FactorValues;
        order.InitialIncentiveMapping = InitialIncentiveMapping;
        order.Rem1IncentiveMapping = Rem1IncentiveMapping;
        order.Rem2IncentiveMapping = Rem2IncentiveMapping;
        return order;
    }

    CreateNewCleaningRule(_name: string, _fileName: string) {
        let cleaningRule = new CleaningRule();
        cleaningRule.Name = _name;
        cleaningRule.Filename = _fileName;

        return cleaningRule;
    }

    CreateNewIncentiveRule(_name: string, _rule: string, _orderType: string) {
        let incentiveRule = new IncentiveRule();
        incentiveRule.Name = _name;
        incentiveRule.Rule = _rule;
        incentiveRule.OrderType = _orderType;

        return incentiveRule;
    }

    ConvertDataType(Data: any[]) {
        Data.forEach(row => {
            switch (row.type) {
                case "nvarchar(MAX)":
                    row.type = "string";
                    break;
                case "int":
                    row.type = "number";
                    break;
                case "decimal":
                    row.type = "number";
                    break;
                default:
                    row.type = "string";
                    break;
            }
        });
        return Data;
    }

    // Api Calls
    // OrdersController
    GetOrders(filter?: string): Observable<any> {
        return this.apiService.Get('Orders?filter=' + filter || null);
    }
    GetOrder(orderCode: string): Observable<any> {
        return this.apiService.Get('Orders/GetOrder/' + orderCode);
    }
    GetOrderDetails(orderCode: string, filter?: string): Observable<any> {
        let postfix = 'Orders/GetOrderDetails/' + orderCode;
        if (filter)
            postfix += filter;
        return this.apiService.Get(postfix);
    }

    DeleteOrder(orderCode: string): Observable<any> {
        let postfix = 'Orders/deleteOrder/' + orderCode;
        return this.apiService.Delete(postfix);
    }

    SaveOrder(order: Order): Observable<any> {
        return this.apiService.Post('orders', order);
    }

    UpdateOrder(order: Order): Observable<any> {
        return this.apiService.Put('Orders', order);
    }

    GetDisabledFields(orderCode: string): Observable<any> {
        return this.apiService.Get('Orders/GetDisabledFields/' + orderCode);
    }

    UploadSamples(orderCode: string, recordType: string, expRecordCount: number, username: string, formData: FormData): Observable<any> {
        let urlpostFix = 'Orders/SampleUpload/' + orderCode + '/' + recordType + '/' + expRecordCount + '?userName=' + username;
        return this.apiService.PostFiles(urlpostFix, formData);
    }
    GenerateMailerDummyData(count, ordercode, username): Observable<any> {
        return this.apiService.Put('Randomize/' + ordercode + '/' + count + '?userName=' + username);
    }
    ConfirmSampleUpload(orderCode: string, fileName: string, recordType: string, expRecordCount: number): Observable<any> {
        return this.apiService.Put('Orders/ConfirmSampleUpload/' + orderCode + '/' + fileName + '/' + recordType + '/' + expRecordCount);
    }
    CancelSampleUpload(orderCode: string, fileName: string): Observable<any> {
        return this.apiService.Put('Orders/CancelSampleUpload/' + orderCode + '/' + fileName);
    }

    //IncentiveController
    GetIncentiveRules(orderType: string): Observable<any> {
        return this.apiService.Get('IncentiveRules/GetIncentiveRulesByOrderType/' + orderType);
    }
    DeleteIncentiveRule(id: number): Observable<any> {
        return this.apiService.Delete('IncentiveRules/Delete/' + id);
    }
    SaveIncentiveRule(rule: IncentiveRule): Observable<any> {
        return this.apiService.Post('IncentiveRules', rule);
    }
    GetIncentiveDetails(ordercode: string): Observable<any> {
        return this.apiService.Get('IncentiveRules/AllRules/' + ordercode);
    }

    ValidateRules(ruleDictionary: any, orderCode: string, IsUpdateStaging: boolean): Observable<any> {
        return this.apiService.Post('IncentiveRules/' + orderCode + "/" + IsUpdateStaging, ruleDictionary);
    }

    // CleaningController
    GetCleaningRules(): Observable<any> {
        return this.apiService.Get('CleaningRule');
    }
    DeleteCleaningRule(id: number): Observable<any> {
        return this.apiService.Delete('CleaningRule/' + id);
    }
    SaveCleaningRule(rule: CleaningRule): Observable<any> {
        return this.apiService.Post('CleaningRule', rule);
    }

    //QueryBuilderController
    GetFields(orderType: string, filterVariable: number): Observable<any> {
        return this.apiService.Get('querybuilder/Variables/' + orderType + '/' + this._orderCode + '?filterVariable=' + filterVariable).map(this.ConvertDataType);
    }
    GetFilterVariablesForIncentive(orderType: string) {
        return this.apiService.Get('querybuilder/GetFilterVariablesForIncentive/' + orderType).map(this.ConvertDataType);
    }

    //Response Controller
    GetResponses(orderCode: string, dataType: string, pageNumber: number, noOfRecords: number, filter?: string, ): Observable<any> {
        var url = 'responses/' + orderCode + '?data=' + dataType + '&pageNumber=' + pageNumber + '&noOfRecords=' + noOfRecords;
        if (filter) url += '&filter=' + filter;
        else url += '&filter=';
        return this.apiService.Get(encodeURI(url));
    }

    GetResponsesCount(orderCode: string, dataType: string, filter?: string): Observable<any> {
        var url = 'responses/count/' + orderCode + '?data=' + dataType;
        if (filter) url += '&filter=' + filter;
        else url += '&filter=';
        return this.apiService.Get(encodeURI(url));
    }

    DownloadResponses(orderCode: string, dataType: string, filter?: string, columns?: string) {
        var url = 'responses/DownloadCSV/' + orderCode + '/' + dataType;
        // if (filter) url += '?filter=' + filter;
        //if (columns) url += '?columns=' + columns;
        // else url += '?filter=';
        let QueryParams = {};
        QueryParams['filter'] = filter;
        QueryParams['columns'] = columns;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        return this.apiService.DownloadCSV(url, QueryParams, options);
        // return this.apiService.DownloadCSV(url,QueryParams, options);
        //55  return this.apiService.Get(encodeURI(url));
    }

    GetStructure(orderType: string) {
        var url = 'Home/GetStructure/' + orderType;
        return this.apiService.Get(encodeURI(url));
    }

    SetReceiptSimulator(orderCode: string, receiptCount: number): Observable<any> {
        return this.apiService.Put('Mailer/SetReceiptDate/' + orderCode + '/' + receiptCount);
    }

    GetInitialMailCount(orderCode: string): Observable<any> {
        return this.apiService.Get('Mailer/GetInitialCount/' + orderCode);
    }
    //InitialMailer Controller
    GetIncentiveDistribution(orderCode: string, type: string, filter?: string): Observable<any> {
        return this.apiService.Get('Mailer/IncentiveDistribution/' + orderCode + '?type=' + type + '&filter=' + filter);
    }
    GetIncentiveRuleDetails(orderCode: string, type: string, filter?: string): Observable<any> {
        return this.apiService.Get('Mailer/IncentiveRuleNCount/' + orderCode + '/' + type + '?filter=' + filter);
    }
    GenerateMailer(orderCode: string, type: string, filter?: string): Observable<any> {
        return this.apiService.Post('Mailer/GenerateMailer/' + orderCode + '/' + type, filter);
    }
    GenerateCsv(orderCode: string, type: string, data: any): Observable<any> {
        return this.apiService.Post('Mailer/GenerateCsv/' + orderCode + '/' + type, data);
    }
    SaveMailerRequest(orderCode: string, type: string, username: string, data: any): Observable<any> {
        return this.apiService.Post('Mailer/SaveMailerRequest/' + orderCode + '/' + type + '?userName=' + username, data);
    }

    DownloadMailer(orderCode: string, fileName: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        return this.apiService.Download('fileOperation/' + orderCode + '?filename=' + fileName, options);
    }

    DownloadZip(fileName: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        return this.apiService.Download('fileOperation/' + 'SPSS' + '?filename=' + fileName, options);
    }

    DownloadMailerIncentiveDetails(orderCode: string, fileName: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        return this.apiService.Download('fileOperation/' + orderCode + '?filename=' + fileName, options);
    }

    DeleteActivity(ID): Observable<any> {
      return this.apiService.Delete('activity/' + ID);
    }

    //PullData Controller
    GetPullRecordCount(orderCode: string, orderType: string, data: any): Observable<any> {
        return this.apiService.Post('pullData/GetRemainingRecords/' + orderCode + '/' + orderType, data);
    }
    PullData(orderCode: string, data: any): Observable<any> {
        return this.apiService.Post('pullData/' + orderCode, data);
    }
    ViewReport(orderCode: string, activityID: number): Observable<any> {
        return this.apiService.Get('pullData/' + orderCode + "/" + activityID);
    }
    GetFiletrVariablesFinalExtractByOrderType(orderType: string): Observable<any> {
        return this.apiService.Get('pullData/GetFiletrVariablesFinalExtractByOrderType/' + orderType).map(this.ConvertDataType);
    }

    //Activity Controller
    GetInitialMailerHistory(orderCode: string, activityType: string): Observable<any> {
        return this.apiService.Get('activity/' + orderCode + '?type=' + activityType);
    }
    InsertActivity(data: any): Observable<any> {
        return this.apiService.Post('activity', data);
    }
    UpdateActivity(data: any): Observable<any> {
        return this.apiService.Put('activity', data);
    }

    GetDisbursementHistory(type: string, dateFrom: string, dateTo: string) {
        if (dateFrom && dateTo)
            return this.apiService.Get('activity?type=' + type + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo);
        else
            return this.apiService.Get('activity?type=' + type);
    }
    //incentive report
    GetIncentiveReport(ordercode: string): Observable<any> {
        return this.apiService.Get('incentive/' + ordercode);
    }

    GetOverallIncentiveDisbursement(): Observable<any> {
        return this.apiService.Get('incentive');
    }
    Generate(IsTest: boolean, userName: string, data: any): Observable<any> {
        return this.apiService.Post('incentive/' + IsTest + '?userName=' + userName, data);
    }

    //ScoreCard Controller
    GetScoreCardSummary(ordercode: string): Observable<any> {
        return this.apiService.Get('ScoreCard/GetSummary/' + ordercode);
    }
    PullRecordsForScoreCarding(orderCode: string, scoreCodeID: string, percent: string, date: string): Observable<any> {
        return this.apiService.PutJSONType('ScoreCard/PullRecordsForScoreCarding/' + orderCode + '/' + scoreCodeID + '/' + percent, date);
    }
    GetQARecords(orderCode: string, scoreCodeID: string, date: string): Observable<any> {
        return this.apiService.Get('ScoreCard/GetQARecords/' + orderCode + '/' + scoreCodeID);
    }
    GetScoreCardSummayInfo(orderCode: string, orderType: string) {
        return this.apiService.Get('ScoreCard/GetScoreCardSummayInfo/' + orderCode + '/' + orderType);
    }
    GetScoreCardSummayInfoTrend(orderCode: string, orderType: string) {
        return this.apiService.Get('ScoreCard/GetScoreCardSummayInfoTrend/' + orderCode + '/' + orderType);
    }
    //OverAll
    GetAcrossOrdersScoreCarding() {
        return this.apiService.Get('ScoreCard/GetAcrossOrdersScoreCarding');
    }

    //Users
    GetUsers() {
        return this.apiService.Get('users');
    }

    InsertUser(data: any): Observable<any> {
        return this.apiService.Post('users', data);
    }

    UpdateUser(data: any, action: string): Observable<any> {
        return this.apiService.Put('users/' + action, data);
    }
    //Roles
    GetRoles() {
        return this.apiService.Get('roles');
    }

    InsertRole(data: any): Observable<any> {
        return this.apiService.Post('roles', data);
    }

    UpdateRole(data: any): Observable<any> {
        return this.apiService.Put('roles', data);
    }

    DeleteRole(ID: number): Observable<any> {
        return this.apiService.Delete('roles/' + ID);
    }

    //Images Controller
    GetImageUrl(orderCode, password, imageView): Observable<any> {
        return this.apiService.Get('Images/GetImages/' + orderCode + '/' + password + '/' + imageView);
    }

    //Compare-Order controller
    GetOrderDetailsForVisibleCash(): Observable<any> {
      return this.apiService.Get('VisibleCashTest/Orders')
    }

    GetVisibleCashTestActivity(): Observable<any> {
      return this.apiService.Get('activity?type=8')
    }

    CompareOrderGenerate(data: any): Observable<any> {
      let user = JSON.parse(localStorage.getItem('currentUser'));
      let username = user['username'];
      return this.apiService.Post('VisibleCashTest/SaveRequest/user?username=' + username , data)
    }

    DownloadOrderComparisonExcel(orderCode: string, fileName: string): Observable<any> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        return this.apiService.Download('fileOperation/excel/' + orderCode + '?filename=' + fileName, options);
    }

    GetCrossTabDefinition():Observable<any>{
        return this.apiService.Get('Crosstab/GetDefinitions');
    }

    DeleteCrossTabDefinition(ID:number):Observable<any>{
        return this.apiService.Delete('Crosstab/' + ID);
    }

    RunCrossTabDefinition(definition:Definition):Observable<any>{
        return this.apiService.Post('Crosstab/RunDefinition',definition);
    }

    SaveCrossTabDefinition(definition:Definition):Observable<any>{
        return this.apiService.Post('Crosstab/SaveDefinition',definition);
    }

    GetDataExportGrid(): Observable<any> {
      return this.apiService.Get('activity?type=9')
    }

    GetOrderForDataExportGrid(): Observable<any> {
      return this.apiService.Get('Orders')
    }

    GenerateDataExport( userName: string, data: any): Observable<any> {
      return this.apiService.Post('DataExport/SaveRequest/user/' + userName + '/', data)
    }

    SaveDataExportDefinition(defintion:ExportDefinition):Observable<any>{
        return this.apiService.Post('DataExport/SaveDefinition',defintion);
    }

    GetDataExportDefinition():Observable<any>{
        return this.apiService.Get('DataExport/GetDefinitions');
    }

    DeleteDataExportDefinition(ID:number):Observable<any>{
        return this.apiService.Delete('DataExport/DeleteDefinition/'+ID);
    }
}


