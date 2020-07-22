import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
    selector: 'app-column-selector-dialog',
    templateUrl: './column-selector-dialog.component.html',
    styleUrls: ['./column-selector-dialog.component.css']
})
export class ColumnSelectorDialogComponent implements OnInit {
    @Input()
    ResponseHeaders: {
        prop: string;
        as: string;
        checked: boolean;
    };
    search: string;
    //selectedColumn: any;
   
    constructor(public activeModal: NgbActiveModal) { }

    ngOnInit() {
        console.log(this.ResponseHeaders);
    }

    SetColumns() {
        let keys = Object.keys(this.ResponseHeaders);
        let arrayOfColumnConfig = [];
        for (var i = 0; i < keys.length; i++) {
            if (this.ResponseHeaders[i].hasOwnProperty("checked") && this.ResponseHeaders[i].checked) {
                let column = {};
                column['prop'] = this.ResponseHeaders[i].prop;
                column['as'] = this.ResponseHeaders[i].as;
               
                arrayOfColumnConfig.push(column);
            }
        }
        if (arrayOfColumnConfig.length > 0)
            this.activeModal.close(arrayOfColumnConfig);
        else
            this.activeModal.close(null);
    }

    ClearAll() {

        localStorage.removeItem('columnSelector');
        let keys = Object.keys(this.ResponseHeaders);
        for (var i = 0; i < keys.length; i++) {
            if (this.ResponseHeaders[i].hasOwnProperty("checked") && this.ResponseHeaders[i].checked) {
                this.ResponseHeaders[i].checked = false;
            }
        }
        this.activeModal.close(null);
    }

}
