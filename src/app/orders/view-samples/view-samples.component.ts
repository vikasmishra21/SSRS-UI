import { Component, OnInit } from '@angular/core';
import { OrdersService } from "../../_services/orders.service";
import { Router, RouterModule } from '@angular/router';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SqlFilterQueryBuilderComponent } from '../../common/sql-filter-query-builder/sql-filter-query-builder.component';
import { ImageViewerComponent } from '../image-viewer/image-viewer.component';
import { Observable } from 'rxjs/Observable';
import { ReceiptSimulatorComponent } from '../receipt-simulator/receipt-simulator.component';
import { ColumnSelectorDialogComponent } from '../column-selector-dialog/column-selector-dialog.component';
import * as FileSaver from 'file-saver';

@Component({
    selector: 'app-view-samples',
    templateUrl: './view-samples.component.html',
    styleUrls: ['./view-samples.component.css']
})
export class ViewSamplesComponent implements OnInit {

    orderCode: string = '';
    dataType: string = 'staging';
    filterString: string = '';
    dummyColumnConfig: any;
    pageLevelFilters = { batch: '', password: '', language: '' }
    group = {
        rules: [{ "operator": "&&", "rules": [] }]
    }
    gridData = {
        data: [],
        columnconfig: [],
        events: {
            rowClicked: this.gridRowClicked.bind(this),
            onCurrentPageChange: this.currentPageChanged.bind(this)
        },
        settings: {
            search: false,
            count: 0,
            currentPage: 1,
        }
    };
    constructor(private router: Router, private orderService: OrdersService, private modalService: NgbModal) { }

    ngOnInit() {
        this.orderCode = this.orderService.GetOrderCode();
        if (!this.orderCode) {
            this.router.navigate(['/orders/overview']);
        } else
            this.GetGridData();
    }

    GetGridData() {
        let orderType = this.orderService.GetOrderType();
        this.orderService.GetStructure(orderType).subscribe(
            response => {
                let tableStructure = response;
                this.getSampleCount().subscribe(
                    samplecount => {
                        this.gridData.settings.count = samplecount;
                        if (this.gridData.settings.count == 0) {
                            this.gridData.settings.count = 1;
                        }
                        this.getSamples().subscribe(
                            response => {
                                this.bindGrid(response, tableStructure);
                            },
                            error => { console.log(error); this.bindGrid([], tableStructure) }
                        );
                    },
                    error => { console.log(error); this.bindGrid([], tableStructure) }
                );
            }
        );
    }



    getSamples(): Observable<any> {
        let filters = this.getPageFilters();
        return this.orderService.GetResponses(this.orderCode, this.dataType, this.gridData.settings.currentPage, 10, filters);
    }
    getSampleCount(): Observable<any> {
        let filters = this.getPageFilters();
        return this.orderService.GetResponsesCount(this.orderCode, this.dataType, filters);
    }

    getPageFilters(): string {
        let filters = [];

        if (this.pageLevelFilters.batch) {
            filters.push("[batch] like '%" + this.pageLevelFilters.batch + "%'");
        }
        if (this.pageLevelFilters.password) {
            filters.push("[s_password] like '%" + this.pageLevelFilters.password + "%'");
        }

        if (this.pageLevelFilters.language) {
            filters.push("[Language] like '%" + this.pageLevelFilters.language + "%'");
        }

        if (!this.filterString)
            return filters.join(" AND ");
        else if (filters.length > 0) {
            return this.filterString + ' AND ' + filters.join(" AND ");
        }
        else
            return this.filterString;
    }

    bindGrid(response, tableStructure) {
        this.gridData.data = [];
        this.gridData.columnconfig = [];
        // this.dummyColumnConfig = Object.assign([], this.gridData.columnconfig);
        if (response.length > 0) {
            let selectedColumns = JSON.parse(localStorage.getItem('columnSelector'));
            if (selectedColumns == null) {
                let columns = Object.keys(tableStructure);
                for (var columnIndex = 0; columnIndex < columns.length; columnIndex++) {
                    let column = {};
                    column['prop'] = tableStructure[columnIndex]['DBColumnName'].replace('[', '').replace(']', '');
                    column['as'] = tableStructure[columnIndex]['DisplayName'];
                    if (tableStructure[columnIndex]['DataType'].toLowerCase() == "datetime")
                        column['cellTemplate'] = 9;
                    this.gridData.columnconfig.push(column);

                }
                this.dummyColumnConfig = Object.assign([], this.gridData.columnconfig);
            }
            else
                this.gridData.columnconfig = selectedColumns;

            this.gridData.data = response;
        }

    }
    gridRowClicked(ev, row, column) {
        this.ShowImageViewerPopup(row);
    }

    currentPageChanged(newPage) {
        this.GetGridData();
    }

    getFilterFields() {
        let fields = [];
        for (var i = 0; i < this.gridData.columnconfig.length; i++) {
            let field = {};
            field['name'] = this.gridData.columnconfig[i]['prop'];
            field['column'] = this.gridData.columnconfig[i]['prop'];
            field['type'] = 'string';
            fields.push(field);
        }
        return fields;
    }

    ShowFilterPopup(event) {
        const modalRef = this.modalService.open(SqlFilterQueryBuilderComponent);
        modalRef.componentInstance.fields = this.getFilterFields();

        modalRef.componentInstance.group = this.group;

        modalRef.result.then((result) => {
            this.group = result.group;
            this.filterString = JSON.parse(result.condition);
            this.GetGridData();
        });
    }

    ShowImageViewerPopup(row) {
        const modalRef = this.modalService.open(ImageViewerComponent);
        modalRef.componentInstance.Sample = row;
        // modalRef.componentInstance.imageUrls = { front: 'https://vignette3.wikia.nocookie.net/dragonball/images/4/47/God_1.jpg', back: 'https://i.pinimg.com/236x/af/b7/80/afb780847197534f7a4476a350a6f381--goku-super-saiyan-god-dbz-vegeta.jpg' }
    }

    ClearFilter() {
        this.filterString = null;
        this.GetGridData();

    }

    OpenReceiptSimulator() {
        const modalRef = this.modalService.open(ReceiptSimulatorComponent, { size: "sm" });
        modalRef.componentInstance.orderCode = this.orderCode;
        modalRef.result.then((result) => {
            this.SetReceiptSimulator(result);

        });
    }



    DownloadCSV() {
        let filters = this.getPageFilters();
        let columns = this.getSelectedColumns();
        this.orderService.DownloadResponses(this.orderCode, this.dataType, filters, columns).subscribe(
            response => { FileSaver.saveAs(response, "Samples.zip"); },
            error => console.log(error)
        );
    }

    getSelectedColumns() {
        let selectedColumns = JSON.parse(localStorage.getItem('columnSelector'));
        if (selectedColumns != null) {
            let columns = [];
            for (var i = 0; i < this.gridData.columnconfig.length; i++) {
                columns.push("[" + this.gridData.columnconfig[i]['prop'] + "]");
            }
            return columns.toString();
        }
        else
            return null;
    }

    SetReceiptSimulator(receiptCount) {
        this.orderService.SetReceiptSimulator(this.orderCode, receiptCount).subscribe(
            response => {
                this.GetGridData();
            },
            error => console.log(error)
        );
    }

    OpenColumnSelector() {
        const modalRef = this.modalService.open(ColumnSelectorDialogComponent, { size: "sm" });
        modalRef.componentInstance.ResponseHeaders = this.dummyColumnConfig;
        modalRef.result.then((result) => {
            //set in local storage
            if (result != null) {
                localStorage.setItem('columnSelector', JSON.stringify(result));
                //modify grid data config
                this.gridData.columnconfig = result;
            }
            else
                this.gridData.columnconfig = this.dummyColumnConfig;
        });
    }

}

