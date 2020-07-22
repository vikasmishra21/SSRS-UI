import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { RouterModule, Routes, CanActivate } from "@angular/router";
import { HttpModule } from "@angular/http";
import { NgxPaginationModule } from "ngx-pagination";
// import { NgProgressModule } from 'ngx-progressbar';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
// import { SimpleNotificationsModule } from 'angular2-notifications-lite';
import { LoadingBarHttpClientModule } from "@ngx-loading-bar/http-client";

// Services
import { ApiService } from "./_services/api.service";
import { AuthenticationService } from "./_services/authentication.service";
import { HomeService } from "./_services/home.service";
import { OrdersService } from "./_services/orders.service";
import { PoReturnsService } from "./_services/po-returns.service";
import { QaService } from "./_services/qa.service";
import { RecordMatchingService } from "./_services/record-matching.service";
import { LoaderSeviceService } from "./_services/loader-sevice.service";

// pipes
import { SearchFilterPipe } from "./_pipes/search-filter.pipe";
import { OrderTypePipe } from "./_pipes/order-type.pipe";
import { DateLocalPipe } from "./_pipes/date-local.pipe";

// guards
import { AuthGuard } from "./_guards/auth.guard";

// Components
import { AppComponent } from "./app.component";
// common
import { DataTableComponent } from "./common/data-table/data-table.component";
import { QueryBuilderScriptComponent } from "./common/query-builder-script/query-builder-script.component";
import { ChartComponent } from "./common/chart/chart.component";
import { SqlFilterQueryBuilderComponent } from "./common/sql-filter-query-builder/sql-filter-query-builder.component";
import { NavbarComponent } from "./common/navbar/navbar.component";
import { SidebarComponent } from "./common/sidebar/sidebar.component";

// Login
import { LoginComponent } from "./login/login.component";
// Home
import { HomeComponent } from "./home/home.component";
// Orders
import { OrdersComponent } from "./orders/orders.component";
import { OrdersOverviewComponent } from "./orders/orders-overview/orders-overview.component";
import { CleaningRulesComponent } from "./orders/cleaning-rules/cleaning-rules.component";
import { IncentiveRulesComponent } from "./orders/incentive-rules/incentive-rules.component";
import { AddNewOrderComponent } from "./orders/add-new-order/add-new-order.component";
import { OrderDetailsComponent } from "./orders/order-details/order-details.component";
import { UploadSampleComponent } from "./orders/upload-sample/upload-sample.component";
import { ImageViewerComponent } from "./orders/image-viewer/image-viewer.component";
import { ViewSamplesComponent } from "./orders/view-samples/view-samples.component";
import { InitialMailerComponent } from "./orders/initial-mailer/initial-mailer.component";
import { CloseorderComponent } from "./orders/closeorder/closeorder.component";
import { FinalDataExtractComponent } from "./orders/final-data-extract/final-data-extract.component";
import { ReminderMailerComponent } from "./orders/reminder-mailer/reminder-mailer.component";
import { IncentivereportComponent } from "./orders/incentivereport/incentivereport.component";
import { FinalDataExtractReportComponent } from "./orders/final-data-extract-report/final-data-extract-report.component";
import { OrderScorecardingComponent } from "./orders/order-scorecarding/order-scorecarding.component";
import { DeleteOrderComponent } from "./orders/delete-order/delete-order.component";

// PostOffice Returns
import { PoReturnsComponent } from "./po-returns/po-returns.component";
import { PoScanComponent } from "./po-returns/po-scan/po-scan.component";
import { PoScanDetailsComponent } from "./po-returns/po-scan-details/po-scan-details.component";
import { PoReportProblemComponent } from "./po-returns/po-report-problem/po-report-problem.component";
import { PodailyReportComponent } from "./po-returns/podaily-report/podaily-report.component";
import { SummaryWindowComponent } from "./po-returns/summary-window/summary-window.component";

//Incentive Report
import { FullIncentiveReportComponent } from "./full-incentive-report/full-incentive-report.component";
import { DisbursementHistoryComponent } from "./full-incentive-report/disbursement-history/disbursement-history.component";
import { ReportIncentiveComponent } from "./full-incentive-report/report-incentive/report-incentive.component";
import { ScorecardingQaResponsesComponent } from "./orders/scorecarding-qa-responses/scorecarding-qa-responses.component";
import { ReceiptSimulatorComponent } from "./orders/receipt-simulator/receipt-simulator.component";

//QA
import { QaComponent } from "./qa/qa.component";
import { ScorecardingOverviewComponent } from "./scorecarding-overview/scorecarding-overview.component";
import { ColumnSelectorDialogComponent } from "./orders/column-selector-dialog/column-selector-dialog.component";

import { UserManagementComponent } from "./user-management/user-management.component";
import { ManageRoleComponent } from "./user-management/manage-role/manage-role.component";
import { AssignUserComponent } from "./user-management/assign-user/assign-user.component";
import { UsersGridComponent } from "./user-management/users-grid/users-grid.component";
import { ChangePasswordComponent } from "./change-password/change-password.component";

//RecordMatching
import { RecordMatchingComponent } from "./record-matching/record-matching.component";

//Directive
import { EleFocusDirective } from "./_directive/ele-focus.directive";
import { PermissionDirective } from "./_directive/permission.directive";

//Loader
import { SsrsLoaderComponent } from "./common/ssrs-loader/ssrs-loader.component";

import { SampleUploadScreenComponent } from "./orders/sample-upload-screen/sample-upload-screen.component";
import { WebJobStatusPipe } from "./_pipes/web-job-status.pipe";
import { ToastComponent } from "./common/toast/toast.component";
import { CompareOrderComponent } from "./compare-order/compare-order.component";
import { CrossTabComponent } from "./cross-tab/cross-tab.component";
import { CrosstabDefinitionComponent } from "./cross-tab/crosstab-definition/crosstab-definition.component";
import { DataExportComponent } from "./data-export/data-export.component";
import { NewExportComponent } from "./data-export/new-export/new-export.component";

const appRoutes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: "recordmatching",
    component: RecordMatchingComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "scorecardingoverview",
    component: ScorecardingOverviewComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "qa/:orderCode/:orderType/:summaryId/:id",
    component: QaComponent,
  },
  {
    path: "compareorder",
    component: CompareOrderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dataexport",
    component: DataExportComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "dataexport/newexport",
    component: NewExportComponent,
    canActivate: [AuthGuard],
  },
  { path: "crosstab", component: CrossTabComponent, canActivate: [AuthGuard] },
  {
    path: "crosstab/newdefinition",
    component: CrosstabDefinitionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "orders",
    component: OrdersComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "overview", pathMatch: "full" },
      { path: "overview", component: OrdersOverviewComponent },
      { path: "cleaning", component: CleaningRulesComponent },
      { path: "incentives", component: IncentiveRulesComponent },
      { path: "sampleupload", component: SampleUploadScreenComponent },
      { path: "orderdetails", component: OrderDetailsComponent },
      { path: "viewsamples", component: ViewSamplesComponent },
      { path: "initialmailer", component: InitialMailerComponent },
      { path: "closeorder", component: CloseorderComponent },
      { path: "final-data-extract", component: FinalDataExtractComponent },
      { path: "remindermailer", component: ReminderMailerComponent },
      { path: "incentivereport", component: IncentivereportComponent },
      { path: "scorecarding", component: OrderScorecardingComponent },
      {
        path: "scorecardingqaresponse",
        component: ScorecardingQaResponsesComponent,
      },
      { path: "deleteorder", component: DeleteOrderComponent },
    ],
  },
  {
    path: "poreturns",
    component: PoReturnsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "scan", pathMatch: "full" },
      { path: "scan", component: PoScanComponent },
      { path: "scandetails", component: PoScanDetailsComponent },
      { path: "reportproblem", component: PoReportProblemComponent },
      { path: "dailyreport", component: PodailyReportComponent },
    ],
  },
  {
    path: "fullincentives",
    component: FullIncentiveReportComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "disbursementhistory", pathMatch: "full" },
      { path: "report", component: ReportIncentiveComponent },
      { path: "disbursementhistory", component: DisbursementHistoryComponent },
    ],
  },
  {
    path: "user",
    component: UserManagementComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "", redirectTo: "usermanagement", pathMatch: "full" },
      { path: "usermanagement", component: UsersGridComponent },
    ],
  },
];

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    OrdersComponent,
    HomeComponent,
    OrdersOverviewComponent,
    CleaningRulesComponent,
    IncentiveRulesComponent,
    DataTableComponent,
    AddNewOrderComponent,
    QueryBuilderScriptComponent,
    SearchFilterPipe,
    OrderDetailsComponent,
    UploadSampleComponent,
    LoginComponent,
    SqlFilterQueryBuilderComponent,
    ChartComponent,
    ImageViewerComponent,
    ViewSamplesComponent,
    InitialMailerComponent,
    OrderScorecardingComponent,
    CloseorderComponent,
    FinalDataExtractComponent,
    ReminderMailerComponent,
    IncentivereportComponent,
    OrderTypePipe,
    FinalDataExtractReportComponent,
    PoReturnsComponent,
    PoScanComponent,
    PoScanDetailsComponent,
    PoReportProblemComponent,
    PodailyReportComponent,
    SummaryWindowComponent,
    FullIncentiveReportComponent,
    DisbursementHistoryComponent,
    ReportIncentiveComponent,
    DateLocalPipe,
    ScorecardingQaResponsesComponent,
    QaComponent,
    ReceiptSimulatorComponent,
    ScorecardingOverviewComponent,
    ColumnSelectorDialogComponent,
    DeleteOrderComponent,
    UserManagementComponent,
    ManageRoleComponent,
    AssignUserComponent,
    UsersGridComponent,
    ChangePasswordComponent,
    RecordMatchingComponent,
    EleFocusDirective,
    SsrsLoaderComponent,
    SampleUploadScreenComponent,
    WebJobStatusPipe,
    PermissionDirective,
    ToastComponent,
    CompareOrderComponent,
    CrossTabComponent,
    CrosstabDefinitionComponent,
    DataExportComponent,
    NewExportComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxPaginationModule,
    RouterModule.forRoot(appRoutes, { useHash: true }),
    NgbModule.forRoot(),
    HttpModule,
    BrowserAnimationsModule,
    LoadingBarHttpClientModule,
  ],
  providers: [
    AuthGuard,
    LoaderSeviceService,
    ApiService,
    HomeService,
    OrdersService,
    PoReturnsService,
    AuthenticationService,
    QaService,
    RecordMatchingService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    AddNewOrderComponent,
    UploadSampleComponent,
    SqlFilterQueryBuilderComponent,
    ImageViewerComponent,
    FinalDataExtractReportComponent,
    ReceiptSimulatorComponent,
    ColumnSelectorDialogComponent,
    ManageRoleComponent,
    AssignUserComponent,
    ChangePasswordComponent,
  ],
})
export class AppModule {}
