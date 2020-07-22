import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OrdersService } from "../../_services/orders.service";
import { UploadSampleValidationResult } from "../../_models/models";
// import { NotificationsService } from 'angular2-notifications-lite';


@Component({
    selector: 'app-upload-sample',
    templateUrl: './upload-sample.component.html',
    styleUrls: ['./upload-sample.component.css']
})
export class UploadSampleComponent implements OnInit {
    @ViewChild('myInput')
    myInputVariable: any;

    OrderID: string;
    Message = "";
    RecordType: string = '1';
    expRecordCount: number = 0;
    DisableFlag: boolean = false;
    formData: FormData;
    ConfirmFlag: boolean = true;
    // errorExpCount: string = "";
    ValidationResult: UploadSampleValidationResult = new UploadSampleValidationResult();
    ShowSpinner: boolean = false;
    constructor(public activeModal: NgbActiveModal,
        private ordersService: OrdersService,
        // private notificationsService: NotificationsService,
    ) { }

    ngOnInit() {
        this.OrderID = this.ordersService.GetOrderCode();
    }

    SetSampleFile(event) {
        //this.errorExpCount = "";
        this.Message = "";
        this.DisableFlag = true;
        this.ConfirmFlag = true;
        let fileList: FileList = event.target.files;
        this.formData= new FormData();

        if (fileList.length > 0) {
            let file: File = fileList[0];
            this.formData.append('sampleFile', file, file.name);
            this.ConfirmFlag = false;
        }else
        this.ConfirmFlag = true;

    }

    ConfirmUpload() {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        this.ordersService.UploadSamples(this.OrderID, this.RecordType, this.expRecordCount,user['username'], this.formData).subscribe(
            response => {
                this.Message = "Your request have been saved Successfully."

            },
            error => {
                this.Message = "Error Occurred while saving your request.";
                console.log(error);
            }
        );

    }

    Close() {
            this.activeModal.close('modal closed');
    }

}
